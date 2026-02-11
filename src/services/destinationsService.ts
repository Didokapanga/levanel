// src/services/destinationsService.ts
import { db } from '../db/database';
import { generateUUID } from '../utils/uuid';
import type { Destination } from '../types/destination';

export const destinationsService = {
    // Liste
    async list(includeDeleted = false): Promise<Destination[]> {
        if (includeDeleted) {
            return db.destinations.toArray();
        }
        return db.destinations.filter(d => !d.is_deleted).toArray();
    },

    // Récupérer par id
    async get(id: string): Promise<Destination | undefined> {
        return db.destinations.get(id);
    },

    // Récupérer par code (très utilisé en réservation)
    async getByCode(code: string): Promise<Destination | undefined> {
        return db.destinations
            .filter(d => d.code === code && !d.is_deleted)
            .first();
    },

    // Créer
    async create(data: {
        name: string;
        city: string;
        country: string;
        code: string;
    }): Promise<Destination | null> {
        // unicité métier : code destination
        const exists = await db.destinations
            .filter(d => d.code === data.code && !d.is_deleted)
            .first();

        if (exists) return null;

        const now = new Date().toISOString();

        const destination: Destination = {
            id: generateUUID(),
            ...data,
            created_at: now,
            updated_at: now,
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',
        };

        await db.destinations.add(destination);
        return destination;
    },

    // Mise à jour
    async update(
        id: string,
        data: Partial<Omit<Destination, 'id' | 'created_at'>>
    ): Promise<Destination | undefined> {
        const destination = await db.destinations.get(id);
        if (!destination || destination.is_deleted) return undefined;

        // contrôle unicité code
        if (data.code && data.code !== destination.code) {
            const exists = await db.destinations
                .filter(
                    d =>
                        d.code === data.code &&
                        d.id !== id &&
                        !d.is_deleted
                )
                .first();

            if (exists) {
                throw new Error('Destination code already exists');
            }
        }

        const updated: Destination = {
            ...destination,
            ...data,
            updated_at: new Date().toISOString(),
            version: destination.version + 1,
            sync_status: 'dirty',
        };

        await db.destinations.put(updated);
        return updated;
    },

    // Soft delete
    async remove(id: string): Promise<boolean> {
        const destination = await db.destinations.get(id);
        if (!destination || destination.is_deleted) return false;

        await db.destinations.put({
            ...destination,
            is_deleted: true,
            updated_at: new Date().toISOString(),
            version: destination.version + 1,
            sync_status: 'dirty',
        });

        return true;
    },
};
