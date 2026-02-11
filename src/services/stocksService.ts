// src/services/stocksService.ts
import { db } from '../db/database';
import { generateUUID } from '../utils/uuid';
import type { Stock } from '../types/stock';

export const stocksService = {

    async list(): Promise<Stock[]> {
        return db.stocks
            .filter(s => !s.is_deleted)
            .toArray();
    },

    async getByContract(contractId: string): Promise<Stock | undefined> {
        return db.stocks
            .filter(s => s.contract_id === contractId && !s.is_deleted)
            .first();
    },

    async create(data: {
        contract_id: string;
        amount: number;
    }): Promise<Stock> {
        const now = new Date().toISOString();

        const stock: Stock = {
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

        await db.stocks.add(stock);
        return stock;
    },

    async consume(stockId: string, amount: number): Promise<void> {
        const stock = await db.stocks.get(stockId);
        if (!stock || stock.is_deleted) {
            throw new Error('Stock not found');
        }

        if (stock.amount_remaining < amount) {
            throw new Error('Insufficient stock');
        }

        stock.amount_remaining -= amount;
        stock.updated_at = new Date().toISOString();
        stock.version += 1;
        stock.sync_status = 'dirty';

        await db.stocks.put(stock);
    },

    async recharge(stockId: string, amount: number): Promise<void> {
        const stock = await db.stocks.get(stockId);
        if (!stock || stock.is_deleted) {
            throw new Error('Stock not found');
        }

        stock.amount_remaining += amount;
        stock.updated_at = new Date().toISOString();
        stock.version += 1;
        stock.sync_status = 'dirty';

        await db.stocks.put(stock);
    },
};
