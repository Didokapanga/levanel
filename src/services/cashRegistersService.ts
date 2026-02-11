// src/services/cashRegistersService.ts
import { db } from '../db/database';
import { generateUUID } from '../utils/uuid';
import type { CashRegister, CashDirection, CashSource } from '../types/cashRegister';

export const cashRegistersService = {
    /* ============================
       LISTING & QUERIES
    ============================ */

    async list(): Promise<CashRegister[]> {
        return db.cash_registers
            .filter(r => !r.is_deleted)
            .toArray();
    },

    async listByPeriod(from: string, to: string): Promise<CashRegister[]> {
        return db.cash_registers
            .filter(
                r =>
                    !r.is_deleted &&
                    r.operation_date >= from &&
                    r.operation_date <= to
            )
            .toArray();
    },

    async listByPartner(partnerId: string): Promise<CashRegister[]> {
        return db.cash_registers
            .filter(r => r.partner_id === partnerId && !r.is_deleted)
            .toArray();
    },

    async listByContract(contractId: string): Promise<CashRegister[]> {
        return db.cash_registers
            .filter(r => r.contract_id === contractId && !r.is_deleted)
            .toArray();
    },

    /* ============================
       CREATE ENTRY (CORE)
    ============================ */

    async create(data: {
        direction: CashDirection;
        source: CashSource;
        amount: number;
        currency: string;

        reference_id?: string;
        contract_id?: string;
        partner_id?: string;
        description?: string;
        operation_date?: string;
    }): Promise<CashRegister> {
        if (data.amount <= 0) {
            throw new Error('Amount must be greater than zero');
        }

        const now = new Date().toISOString();

        const entry: CashRegister = {
            id: generateUUID(),

            direction: data.direction,
            source: data.source,
            reference_id: data.reference_id,

            contract_id: data.contract_id,
            partner_id: data.partner_id,

            amount: data.amount,
            currency: data.currency,

            operation_date: data.operation_date ?? now,
            description: data.description,

            created_at: now,
            updated_at: now,
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',
        };

        await db.cash_registers.add(entry);
        return entry;
    },

    /* ============================
       BUSINESS SHORTCUTS
    ============================ */

    async recordReservationPayment(data: {
        reservation_id: string;
        contract_id: string;
        partner_id: string;
        amount_received: number;
        currency: string;
    }) {
        return this.create({
            direction: 'in',
            source: 'reservation',
            reference_id: data.reservation_id,
            contract_id: data.contract_id,
            partner_id: data.partner_id,
            amount: data.amount_received,
            currency: data.currency,
            description: 'Paiement réservation',
        });
    },

    async recordExpense(data: {
        amount: number;
        currency: string;
        description: string;
        partner_id?: string;
    }) {
        return this.create({
            direction: 'out',
            source: 'expense',
            amount: data.amount,
            currency: data.currency,
            description: data.description,
            partner_id: data.partner_id,
        });
    },

    async recordRefund(data: {
        reservation_id: string;
        amount: number;
        currency: string;
        partner_id?: string;
    }) {
        return this.create({
            direction: 'out',
            source: 'refund',
            reference_id: data.reservation_id,
            amount: data.amount,
            currency: data.currency,
            partner_id: data.partner_id,
            description: 'Remboursement client',
        });
    },

    /* ============================
       SOFT DELETE (RARE)
    ============================ */

    async softDelete(id: string): Promise<void> {
        const entry = await db.cash_registers.get(id);
        if (!entry) return;

        entry.is_deleted = true;
        entry.updated_at = new Date().toISOString();
        entry.version += 1;
        entry.sync_status = 'dirty';

        await db.cash_registers.put(entry);
    },
};
