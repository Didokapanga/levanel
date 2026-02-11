import { db } from '../db/database';
import { generateUUID } from '../utils/uuid';
import type { Caution } from '../types/caution';

export const cautionsService = {
    async list(includeDeleted = false): Promise<Caution[]> {
        if (includeDeleted) {
            return db.cautions.toArray();
        }
        return db.cautions.filter(c => !c.is_deleted).toArray();
    },

    async getByContract(contractId: string): Promise<Caution | undefined> {
        return db.cautions
            .filter(c => c.contract_id === contractId && !c.is_deleted)
            .first();
    },

    async create(data: {
        contract_id: string;
        amount: number;
    }): Promise<Caution> {
        const now = new Date().toISOString();

        const caution: Caution = {
            id: generateUUID(),
            contract_id: data.contract_id,
            amount_initial: data.amount,
            amount_remaining: data.amount,
            created_at: now,
            updated_at: now,
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',
        };

        await db.cautions.add(caution);
        return caution;
    },

    async consume(cautionId: string, amount: number): Promise<void> {
        const caution = await db.cautions.get(cautionId);
        if (!caution || caution.is_deleted) {
            throw new Error('Caution not found');
        }

        if (caution.amount_remaining < amount) {
            throw new Error('Insufficient caution amount');
        }

        caution.amount_remaining -= amount;
        caution.updated_at = new Date().toISOString();
        caution.version += 1;
        caution.sync_status = 'dirty';

        await db.cautions.put(caution);
    },

    async recharge(cautionId: string, amount: number): Promise<void> {
        const caution = await db.cautions.get(cautionId);
        if (!caution || caution.is_deleted) {
            throw new Error('Caution not found');
        }

        caution.amount_remaining += amount;
        caution.updated_at = new Date().toISOString();
        caution.version += 1;
        caution.sync_status = 'dirty';

        await db.cautions.put(caution);
    },
};
