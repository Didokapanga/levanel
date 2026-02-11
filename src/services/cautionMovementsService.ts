// src/services/cautionMovementsService.ts
import { db } from '../db/database';
import { generateUUID } from '../utils/uuid';
import type { CautionMovement, MovementType } from '../types/cautionMovement';

export const cautionMovementsService = {
    async create(data: {
        caution_id: string;
        reservation_id?: string;
        type: MovementType;
        amount: number;
        description?: string;
        created_by?: string;
    }): Promise<CautionMovement> {
        const now = new Date().toISOString();

        const movement: CautionMovement = {
            id: generateUUID(),
            caution_id: data.caution_id,
            reservation_id: data.reservation_id,
            type: data.type,
            amount: data.amount,
            description: data.description,
            created_by: data.created_by,
            created_at: now,
            updated_at: now,
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',
        };

        await db.caution_movements.add(movement);
        return movement;
    },

    async listByCaution(cautionId: string) {
        return db.caution_movements
            .where('caution_id')
            .equals(cautionId)
            .filter(m => !m.is_deleted)
            .toArray();
    },

    async listAll() {
        return db.caution_movements
            .filter(m => !m.is_deleted)
            .toArray();
    },
};
