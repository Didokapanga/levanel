// src/services/partnersService.ts
import { db } from '../db/database';
import { generateUUID } from '../utils/uuid';
import type { Partner, PartnerType } from '../types/partner';

export const partnersService = {
    // Lister
    async list(includeDeleted = false): Promise<Partner[]> {
        if (includeDeleted) {
            return db.partners.toArray();
        }
        return db.partners.filter(p => !p.is_deleted).toArray();
    },

    // Récupérer par id
    async get(id: string): Promise<Partner | undefined> {
        return db.partners.get(id);
    },

    // Récupérer par type (utile UI)
    async listByType(type: PartnerType): Promise<Partner[]> {
        return db.partners
            .filter(p => p.type === type && !p.is_deleted)
            .toArray();
    },

    // Créer
    async create(data: {
        name: string;
        type: PartnerType;
    }): Promise<Partner | null> {
        // unicité métier
        const exists = await db.partners
            .filter(
                p =>
                    p.name.toLowerCase() === data.name.toLowerCase() &&
                    p.type === data.type &&
                    !p.is_deleted
            )
            .first();

        if (exists) return null;

        const now = new Date().toISOString();

        const partner: Partner = {
            id: generateUUID(),
            name: data.name,
            type: data.type,
            created_at: now,
            updated_at: now,
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',
        };

        await db.partners.add(partner);
        return partner;
    },

    // Mise à jour
    async update(
        id: string,
        data: Partial<Omit<Partner, 'id' | 'created_at'>>
    ): Promise<Partner | undefined> {
        const partner = await db.partners.get(id);
        if (!partner || partner.is_deleted) return undefined;

        // contrôle unicité
        if (data.name || data.type) {
            const name = data.name ?? partner.name;
            const type = data.type ?? partner.type;

            const exists = await db.partners
                .filter(
                    p =>
                        p.id !== id &&
                        p.name.toLowerCase() === name.toLowerCase() &&
                        p.type === type &&
                        !p.is_deleted
                )
                .first();

            if (exists) {
                throw new Error('Partner already exists for this type');
            }
        }

        const updated: Partner = {
            ...partner,
            ...data,
            updated_at: new Date().toISOString(),
            version: partner.version + 1,
            sync_status: 'dirty',
        };

        await db.partners.put(updated);
        return updated;
    },

    // Soft delete
    async remove(id: string): Promise<boolean> {
        const partner = await db.partners.get(id);
        if (!partner || partner.is_deleted) return false;

        await db.partners.put({
            ...partner,
            is_deleted: true,
            updated_at: new Date().toISOString(),
            version: partner.version + 1,
            sync_status: 'dirty',
        });

        return true;
    },
};
