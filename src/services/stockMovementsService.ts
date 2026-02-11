// src/services/stockMovementsService.ts
import { db } from '../db/database';
import { generateUUID } from '../utils/uuid';
import type { StockMovement, StockMovementType } from '../types/stockMovement';

export const stockMovementsService = {
    async create(data: {
        stock_id: string;
        reservation_id?: string;
        type: StockMovementType;
        amount: number;
        created_by: string;
    }): Promise<StockMovement> {
        const now = new Date().toISOString();
        const movement: StockMovement = {
            id: generateUUID(),
            stock_id: data.stock_id,
            reservation_id: data.reservation_id,
            type: data.type,
            amount: data.amount,
            created_by: data.created_by,
            created_at: now,
            updated_at: now,
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',
        };

        await db.stock_movements.add(movement);
        return movement;
    },

    async listByStock(stockId: string) {
        return db.stock_movements
            .where('stock_id')
            .equals(stockId)
            .filter(m => !m.is_deleted)
            .toArray();
    },

    async listAll() {
        return db.stock_movements
            .filter(m => !m.is_deleted)
            .toArray();
    },
};
