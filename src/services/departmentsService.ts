// src/services/departmentsService.ts
import { db } from '../db/database';
import { generateUUID } from '../utils/uuid';
import type { Department } from '../types/department';

export const departmentsService = {
    // Lister tous les départements (optionnel: exclure les supprimés)
    async list(includeDeleted = false): Promise<Department[]> {
        if (includeDeleted) {
            return db.departments.toArray();
        } else {
            // Utilisation de filter pour éviter le problème boolean dans .equals()
            return db.departments.filter(d => !d.is_deleted).toArray();
        }
    },

    // Récupérer un département par id
    async get(id: string): Promise<Department | undefined> {
        return db.departments.get(id);
    },

    // Créer un département
    async create(name: string): Promise<Department> {
        const timestamp = new Date().toISOString();
        const newDept: Department = {
            id: generateUUID(),
            name,
            created_at: timestamp,
            updated_at: timestamp,
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',
        };
        await db.departments.add(newDept);
        return newDept;
    },

    // Mettre à jour un département
    async update(id: string, name: string): Promise<Department | undefined> {
        const dept = await db.departments.get(id);
        if (!dept || dept.is_deleted) return undefined;

        const timestamp = new Date().toISOString();
        const updatedDept: Department = {
            ...dept,
            name,
            updated_at: timestamp,
            version: dept.version + 1,
            sync_status: 'dirty',
        };
        await db.departments.put(updatedDept);
        return updatedDept;
    },

    // Soft delete
    async remove(id: string): Promise<boolean> {
        const dept = await db.departments.get(id);
        if (!dept || dept.is_deleted) return false;

        const timestamp = new Date().toISOString();
        await db.departments.put({
            ...dept,
            is_deleted: true,
            updated_at: timestamp,
            version: dept.version + 1,
            sync_status: 'dirty',
        });
        return true;
    },
};
