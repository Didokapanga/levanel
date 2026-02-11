// src/services/syncStateService.ts
import { db } from '../db/database';
import type { SyncStatus } from '../types/syncState';
import { generateUUID } from '../utils/uuid';

export const syncStateService = {
    // Lister tous les états
    async list() {
        return db.sync_state.toArray();
    },

    // Récupérer l'état d'une table
    async get(table_name: string) {
        return db.sync_state.where('table_name').equals(table_name).first();
    },

    // Créer ou mettre à jour l'état
    async upsert(table_name: string, status: SyncStatus, last_synced_at?: string) {
        const existing = await db.sync_state.where('table_name').equals(table_name).first();
        if (existing) {
            return db.sync_state.update(existing.id!, { sync_status: status, last_synced_at });
        } else {
            return db.sync_state.add({
                id: generateUUID(),
                table_name,
                sync_status: status,
                last_synced_at,
            });
        }
    },

    // Marquer une table comme "clean"
    async markClean(table_name: string) {
        return this.upsert(table_name, 'clean', new Date().toISOString());
    },

    // Marquer une table comme "dirty"
    async markDirty(table_name: string) {
        return this.upsert(table_name, 'dirty');
    },

    // Marquer une table comme "conflict"
    async markConflict(table_name: string) {
        return this.upsert(table_name, 'conflict');
    },
};
