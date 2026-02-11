// src/services/financialOperationsService.ts
import { db } from '../db/database';
import type { FinancialOperation } from '../types/financialOperation';

export const financialOperationsService = {
    // Lister toutes les opérations avec pagination
    async list(page = 1, pageSize = 10) {
        const offset = (page - 1) * pageSize;
        return db.financial_operations
            .orderBy('created_at')
            .offset(offset)
            .limit(pageSize)
            .toArray();
    },

    // Obtenir une opération par ID
    async get(id: string): Promise<FinancialOperation | undefined> {
        return db.financial_operations.get(id);
    },

    // Créer une nouvelle opération
    async create(data: Omit<FinancialOperation, 'id' | 'created_at' | 'updated_at' | 'version' | 'is_deleted' | 'sync_status'>) {
        const now = new Date().toISOString();
        const newOp: FinancialOperation = {
            id: crypto.randomUUID(),
            ...data,
            created_at: now,
            updated_at: now,
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',
        };
        await db.financial_operations.add(newOp);
        return newOp;
    },

    // Mettre à jour une opération existante
    async update(id: string, data: Partial<Omit<FinancialOperation, 'id' | 'created_at' | 'version'>>) {
        const now = new Date().toISOString();
        await db.financial_operations.update(id, {
            ...data,
            updated_at: now,
            version: (await db.financial_operations.get(id))?.version! + 1,
            sync_status: 'dirty',
        });
    },

    // Supprimer une opération (soft delete)
    async delete(id: string) {
        const now = new Date().toISOString();
        await db.financial_operations.update(id, {
            is_deleted: true,
            updated_at: now,
            version: (await db.financial_operations.get(id))?.version! + 1,
            sync_status: 'dirty',
        });
    },
};
