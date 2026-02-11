// src/services/rolesService.ts
import { db } from '../db/database';
import { generateUUID } from '../utils/uuid';
import type { Role, UserRole } from '../types/roles';

export const rolesService = {
    // Lister tous les rôles (optionnel: exclure les supprimés)
    async list(includeDeleted = false): Promise<Role[]> {
        if (includeDeleted) {
            return db.roles.toArray();
        } else {
            return db.roles.filter(role => role.is_deleted === false).toArray();
        }
    },

    // Créer un nouveau rôle
    async create(name: UserRole): Promise<Role> {
        const role: Role = {
            id: generateUUID(),
            name, // type-safe
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',
        };
        await db.roles.add(role);
        return role;
    },

    // Récupérer un rôle par son id
    async getById(id: string): Promise<Role | undefined> {
        return db.roles.get(id);
    },

    // Mettre à jour un rôle existant
    async update(id: string, name: UserRole): Promise<Role | undefined> {
        const role = await db.roles.get(id);
        if (!role) return undefined;

        role.name = name;
        role.updated_at = new Date().toISOString();
        role.version += 1;
        role.sync_status = 'dirty';

        await db.roles.put(role);
        return role;
    },

    // Supprimer (soft delete) un rôle
    async remove(id: string): Promise<boolean> {
        const role = await db.roles.get(id);
        if (!role) return false;

        role.is_deleted = true;
        role.updated_at = new Date().toISOString();
        role.version += 1;
        role.sync_status = 'dirty';

        await db.roles.put(role);
        return true;
    },
};