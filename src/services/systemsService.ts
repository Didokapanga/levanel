// src/services/systemsService.ts
import { db } from '../db/database';
import { generateUUID } from '../utils/uuid';
import type { System } from '../types/system';

export const systemsService = {
    // Liste des systèmes
    async list(includeDeleted = false): Promise<System[]> {
        if (includeDeleted) {
            return db.systems.toArray();
        }
        return db.systems.filter(s => !s.is_deleted).toArray();
    },

    // Récupérer par id
    async get(id: string): Promise<System | undefined> {
        return db.systems.get(id);
    },

    // Créer
    async create(name: string): Promise<System> {
        const now = new Date().toISOString();

        const system: System = {
            id: generateUUID(),
            name,
            created_at: now,
            updated_at: now,
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',
        };

        await db.systems.add(system);
        return system;
    },

    // Mettre à jour
    async update(id: string, name: string): Promise<System | undefined> {
        const system = await db.systems.get(id);
        if (!system || system.is_deleted) return undefined;

        const updated: System = {
            ...system,
            name,
            updated_at: new Date().toISOString(),
            version: system.version + 1,
            sync_status: 'dirty',
        };

        await db.systems.put(updated);
        return updated;
    },

    // Soft delete
    async remove(id: string): Promise<boolean> {
        const system = await db.systems.get(id);
        if (!system || system.is_deleted) return false;

        await db.systems.put({
            ...system,
            is_deleted: true,
            updated_at: new Date().toISOString(),
            version: system.version + 1,
            sync_status: 'dirty',
        });

        return true;
    },
};
