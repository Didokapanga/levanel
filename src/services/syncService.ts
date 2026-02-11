import { db } from '../db/database';
import { supabase } from './supabaseClient';

const syncableTables: (keyof typeof db)[] = [
    'users',
    'departments',
    'systems',
    'airlines',
    'payment_methods',
    'destinations',
    'partners',
    'contracts',
    'cautions',
    'stocks',
    'financial_operations',
    'reservations',
    'reservation_segments',
    'cash_registers',
    'audit_logs',
    'change_logs',
    'sync_state',
    'roles'
];

export class SyncService {
    private isSyncing = false;

    // ===============================
    // PUSH LES CHANGEMENTS LOCAUX VERS SUPABASE
    // ===============================
    async pushChanges() {
        for (const tableName of syncableTables) {
            const table = db.table(tableName);
            const dirtyItems = await table.where('sync_status').equals('dirty').toArray();

            for (const item of dirtyItems) {
                try {
                    // Récupérer l'élément sur le serveur pour comparer updated_at
                    const { data: remoteItem, error: fetchError } = await supabase
                        .from(tableName)
                        .select('*')
                        .eq('id', item.id)
                        .single();

                    if (fetchError && fetchError.code !== 'PGRST116') { // ignore "row not found"
                        console.error(`Fetch error ${tableName} ${item.id}:`, fetchError);
                        continue;
                    }

                    if (remoteItem) {
                        const localTime = new Date(item.updated_at).getTime();
                        const remoteTime = new Date(remoteItem.updated_at).getTime();

                        if (localTime <= remoteTime) {
                            // Le serveur est plus récent, marquer en conflit
                            await table.update(item.id, { sync_status: 'conflict' });
                            continue;
                        }
                    }

                    // Push/upsert sur Supabase
                    const { error } = await supabase.from(tableName).upsert(item);

                    if (error) {
                        console.error(`Push error ${tableName}:`, error);
                        continue;
                    }

                    // Marquer comme clean localement
                    await table.update(item.id, {
                        sync_status: 'clean',
                        updated_at: new Date().toISOString()
                    });
                } catch (err) {
                    console.error(`Push exception ${tableName} ${item.id}:`, err);
                }
            }
        }
    }

    // ===============================
    // PULL LES CHANGEMENTS DU SERVEUR VERS LOCAL
    // ===============================
    async pullChanges() {
        for (const tableName of syncableTables) {
            try {
                const { data, error } = await supabase.from(tableName).select('*');
                if (error || !data) continue;

                const table = db.table(tableName);

                for (const remote of data) {
                    const local = await table.get(remote.id);

                    if (!local) {
                        // Item inexistant localement → ajouter
                        await table.put({ ...remote, sync_status: 'clean' });
                        continue;
                    }

                    const localTime = new Date(local.updated_at).getTime();
                    const remoteTime = new Date(remote.updated_at).getTime();

                    if (remoteTime > localTime) {
                        // Supabase plus récent → update local
                        await table.put({ ...remote, sync_status: 'clean' });
                    } else if (localTime > remoteTime) {
                        // Local plus récent → marquer conflit
                        await table.update(local.id, { sync_status: 'conflict' });
                    }
                }
            } catch (err) {
                console.error(`Pull exception ${tableName}:`, err);
            }
        }
    }

    // ===============================
    // SYNC COMPLET
    // ===============================
    async syncAll() {
        if (this.isSyncing) return;
        this.isSyncing = true;

        try {
            await this.pushChanges();
            await this.pullChanges();
            console.log('🔄 Synchronisation terminée');
        } catch (err) {
            console.error('Sync failed:', err);
        } finally {
            this.isSyncing = false;
        }
    }

    // ===============================
    // AUTO-SYNC INTERVALLE
    // ===============================
    startAutoSync(intervalMs = 5 * 60 * 1000) {
        this.syncAll(); // sync initial
        setInterval(() => this.syncAll(), intervalMs);
    }
}

export const syncService = new SyncService();
