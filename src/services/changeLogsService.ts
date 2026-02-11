// src/services/changeLogsService.ts
import { db } from '../db/database';
import type { ChangeLog } from '../types/changeLog';

export const changeLogsService = {
    async list(page = 1, pageSize = 10) {
        const offset = (page - 1) * pageSize;

        const all = await db.change_logs.toArray();

        const filtered = all
            .filter(log => !log.is_deleted)
            .sort(
                (a, b) =>
                    new Date(b.updated_at).getTime() -
                    new Date(a.updated_at).getTime()
            );

        return filtered.slice(offset, offset + pageSize);
    },

    async count(): Promise<number> {
        const all = await db.change_logs.toArray();
        return all.filter(log => !log.is_deleted).length;
    },

    async get(id: string): Promise<ChangeLog | undefined> {
        return db.change_logs.get(id);
    },

    async create(
        data: Omit<
            ChangeLog,
            'id' | 'created_at' | 'updated_at' | 'version' | 'is_deleted' | 'sync_status'
        >
    ) {
        const now = new Date().toISOString();

        const newLog: ChangeLog = {
            id: crypto.randomUUID(),
            ...data,
            created_at: now,
            updated_at: now,
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',
        };

        await db.change_logs.add(newLog);
        return newLog;
    },

    async update(
        id: string,
        data: Partial<Omit<ChangeLog, 'id' | 'created_at' | 'version'>>
    ) {
        const log = await db.change_logs.get(id);
        if (!log) return;

        await db.change_logs.update(id, {
            ...data,
            updated_at: new Date().toISOString(),
            version: log.version + 1,
            sync_status: 'dirty',
        });
    },

    async delete(id: string) {
        const log = await db.change_logs.get(id);
        if (!log) return;

        await db.change_logs.update(id, {
            is_deleted: true,
            updated_at: new Date().toISOString(),
            version: log.version + 1,
            sync_status: 'dirty',
        });
    },
};
