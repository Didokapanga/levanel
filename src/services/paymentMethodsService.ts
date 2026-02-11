// src/services/paymentMethodsService.ts
import { db } from '../db/database';
import { generateUUID } from '../utils/uuid';
import type { PaymentMethod } from '../types/paymentMethod';

export const paymentMethodsService = {
    // Liste
    async list(includeDeleted = false): Promise<PaymentMethod[]> {
        if (includeDeleted) {
            return db.payment_methods.toArray();
        }
        return db.payment_methods.filter(p => !p.is_deleted).toArray();
    },

    // Récupérer par id
    async get(id: string): Promise<PaymentMethod | undefined> {
        return db.payment_methods.get(id);
    },

    // Créer
    async create(label: string): Promise<PaymentMethod | null> {
        // éviter doublons logiques (ex: "Cash" vs "cash")
        const exists = await db.payment_methods
            .filter(p => p.label.toLowerCase() === label.toLowerCase() && !p.is_deleted)
            .first();

        if (exists) {
            return null;
        }

        const now = new Date().toISOString();

        const paymentMethod: PaymentMethod = {
            id: generateUUID(),
            label,
            created_at: now,
            updated_at: now,
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',
        };

        await db.payment_methods.add(paymentMethod);
        return paymentMethod;
    },

    // Mise à jour
    async update(
        id: string,
        data: { label?: string }
    ): Promise<PaymentMethod | undefined> {
        const paymentMethod = await db.payment_methods.get(id);
        if (!paymentMethod || paymentMethod.is_deleted) return undefined;

        // Vérifier unicité du label si modifié
        if (data.label && data.label !== paymentMethod.label) {
            const exists = await db.payment_methods
                .filter(
                    p =>
                        p.label.toLowerCase() === data.label!.toLowerCase() &&
                        p.id !== id &&
                        !p.is_deleted
                )
                .first();

            if (exists) {
                throw new Error('Payment method already exists');
            }
        }

        const updated: PaymentMethod = {
            ...paymentMethod,
            ...data,
            updated_at: new Date().toISOString(),
            version: paymentMethod.version + 1,
            sync_status: 'dirty',
        };

        await db.payment_methods.put(updated);
        return updated;
    },

    // Soft delete
    async remove(id: string): Promise<boolean> {
        const paymentMethod = await db.payment_methods.get(id);
        if (!paymentMethod || paymentMethod.is_deleted) return false;

        await db.payment_methods.put({
            ...paymentMethod,
            is_deleted: true,
            updated_at: new Date().toISOString(),
            version: paymentMethod.version + 1,
            sync_status: 'dirty',
        });

        return true;
    },
};
