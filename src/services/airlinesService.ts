// src/services/airlinesService.ts
import { db } from '../db/database';
import { generateUUID } from '../utils/uuid';
import type { Airline } from '../types/airline';

export const airlinesService = {
    // Liste
    async list(includeDeleted = false): Promise<Airline[]> {
        if (includeDeleted) {
            return db.airlines.toArray();
        }
        return db.airlines.filter(a => !a.is_deleted).toArray();
    },

    // Récupérer par id
    async get(id: string): Promise<Airline | undefined> {
        return db.airlines.get(id);
    },

    // Récupérer par code (utile pour reservation_segments)
    async getByCode(code: string): Promise<Airline | undefined> {
        return db.airlines.where('code').equalsIgnoreCase(code).first();
    },

    // Créer
    async create(code: string, name: string): Promise<Airline | null> {
        // Vérifier unicité du code
        const exists = await db.airlines
            .where('code')
            .equalsIgnoreCase(code)
            .first();

        if (exists && !exists.is_deleted) {
            return null;
        }

        const now = new Date().toISOString();

        const airline: Airline = {
            id: generateUUID(),
            code: code.toUpperCase(),
            name,
            created_at: now,
            updated_at: now,
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',
        };

        await db.airlines.add(airline);
        return airline;
    },

    // Mise à jour
    async update(
        id: string,
        data: { code?: string; name?: string }
    ): Promise<Airline | undefined> {
        const airline = await db.airlines.get(id);
        if (!airline || airline.is_deleted) return undefined;

        // Si le code change → vérifier unicité
        if (data.code && data.code !== airline.code) {
            const exists = await db.airlines
                .where('code')
                .equalsIgnoreCase(data.code)
                .first();

            if (exists && exists.id !== id && !exists.is_deleted) {
                throw new Error('Airline code already exists');
            }
        }

        const updated: Airline = {
            ...airline,
            ...data,
            code: data.code ? data.code.toUpperCase() : airline.code,
            updated_at: new Date().toISOString(),
            version: airline.version + 1,
            sync_status: 'dirty',
        };

        await db.airlines.put(updated);
        return updated;
    },

    // Soft delete
    async remove(id: string): Promise<boolean> {
        const airline = await db.airlines.get(id);
        if (!airline || airline.is_deleted) return false;

        await db.airlines.put({
            ...airline,
            is_deleted: true,
            updated_at: new Date().toISOString(),
            version: airline.version + 1,
            sync_status: 'dirty',
        });

        return true;
    },
};
