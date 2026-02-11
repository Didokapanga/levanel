import { db } from '../db/database';
import { generateUUID } from '../utils/uuid';
import type { Contract, ContractStatus, ContractType } from '../types/contract';

export const contractsService = {
    async list(includeDeleted = false): Promise<Contract[]> {
        if (includeDeleted) {
            return db.contracts.toArray();
        }
        return db.contracts.filter(c => !c.is_deleted).toArray();
    },

    async getById(id: string): Promise<Contract | undefined> {
        return db.contracts.get(id);
    },

    async listByPartner(partnerId: string): Promise<Contract[]> {
        return db.contracts
            .filter(c => c.partner_id === partnerId && !c.is_deleted)
            .toArray();
    },

    async getActiveByPartner(partnerId: string): Promise<Contract | undefined> {
        const today = new Date().toISOString();

        return db.contracts
            .filter(
                c =>
                    c.partner_id === partnerId &&
                    !c.is_deleted &&
                    (!c.end_date || c.end_date >= today)
            )
            .first();
    },

    async create(data: {
        partner_id: string;
        contract_type: ContractType;
        contract_status: ContractStatus;
        start_date: string;
        end_date?: string;
    }): Promise<Contract> {
        const now = new Date().toISOString();

        const contract: Contract = {
            id: generateUUID(),
            partner_id: data.partner_id,
            contract_type: data.contract_type,
            status: data.contract_status,
            start_date: data.start_date,
            end_date: data.end_date,
            created_at: now,
            updated_at: now,
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',
        };

        await db.contracts.add(contract);
        return contract;
    },

    async closeContract(id: string): Promise<boolean> {
        const contract = await db.contracts.get(id);
        if (!contract || contract.is_deleted) return false;

        contract.end_date = new Date().toISOString();
        contract.updated_at = contract.end_date;
        contract.version += 1;
        contract.sync_status = 'dirty';

        await db.contracts.put(contract);
        return true;
    },
};
