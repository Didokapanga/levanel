import { db } from '../db/database';
import type { AuditLog } from '../types/auditLog';

const AUDIT_ACTIONS = ['validate', 'cancel'];

export const auditLogsService = {
    // -------------------------
    // 🔹 LOGS MÉTIER (UI AUDIT)
    // -------------------------

    async listBusinessLogs(page = 1, pageSize = 10): Promise<AuditLog[]> {
        const offset = (page - 1) * pageSize;

        return db.audit_logs
            .where('entity_name')
            .equals('reservations')
            .filter(log => AUDIT_ACTIONS.includes(log.action))
            .reverse()
            .offset(offset)
            .limit(pageSize)
            .toArray();
    },

    async countBusinessLogs(): Promise<number> {
        return db.audit_logs
            .where('entity_name')
            .equals('reservations')
            .filter(log => AUDIT_ACTIONS.includes(log.action))
            .count();
    },

    // -------------------------
    // 🔹 MÉTHODES GÉNÉRIQUES
    // -------------------------

    async list(page = 1, pageSize = 10): Promise<AuditLog[]> {
        const offset = (page - 1) * pageSize;
        return db.audit_logs
            .orderBy('timestamp')
            .reverse()
            .offset(offset)
            .limit(pageSize)
            .toArray();
    },

    async get(id: string): Promise<AuditLog | undefined> {
        return db.audit_logs.get(id);
    },

    async create(
        data: Omit<
            AuditLog,
            'id' | 'created_at' | 'updated_at' | 'version' | 'is_deleted' | 'sync_status'
        >
    ): Promise<AuditLog> {
        const now = new Date().toISOString();

        const newLog: AuditLog = {
            id: crypto.randomUUID(),
            ...data,
            created_at: now,
            updated_at: now,
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',
        };

        await db.audit_logs.add(newLog);
        return newLog;
    },

    async update(
        id: string,
        data: Partial<Omit<AuditLog, 'id' | 'created_at' | 'version'>>
    ) {
        const log = await db.audit_logs.get(id);
        if (!log) return;

        await db.audit_logs.update(id, {
            ...data,
            updated_at: new Date().toISOString(),
            version: log.version + 1,
            sync_status: 'dirty',
        });
    },

    async delete(id: string) {
        const log = await db.audit_logs.get(id);
        if (!log) return;

        await db.audit_logs.update(id, {
            is_deleted: true,
            updated_at: new Date().toISOString(),
            version: log.version + 1,
            sync_status: 'dirty',
        });
    },
};
