import { db } from '../db/database';
import type { User } from '../types/users';
import { generateUUID } from '../utils/uuid';
import bcrypt from 'bcryptjs';

export const usersService = {
    // -----------------------------
    // Lister les utilisateurs
    // -----------------------------
    async list(includeDeleted = false): Promise<User[]> {
        const allUsers = await db.users.toArray();
        return includeDeleted ? allUsers : allUsers.filter(u => !u.is_deleted);
    },

    // -----------------------------
    // Récupérer un utilisateur par ID
    // -----------------------------
    async getById(id: string): Promise<User | undefined> {
        return db.users.get(id);
    },

    // -----------------------------
    // Créer un nouvel utilisateur (hash mot de passe)
    // -----------------------------
    async create(userData: { username: string; role_id: string; plainPassword: string }): Promise<User> {
        const timestamp = new Date().toISOString();
        const hashed = await bcrypt.hash(userData.plainPassword, 10);

        const newUser: User = {
            id: generateUUID(),
            username: userData.username,
            role_id: userData.role_id,
            password: hashed, // ✅ stock le hash
            created_at: timestamp,
            updated_at: timestamp,
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',
        };

        await db.users.add(newUser);
        return newUser;
    },

    // -----------------------------
    // Vérifier mot de passe pour login
    // -----------------------------
    async checkPassword(username: string, plainPassword: string): Promise<boolean> {
        const user = await db.users.where('username').equals(username).first();
        if (!user) return false;
        return bcrypt.compare(plainPassword, user.password);
    },

    // -----------------------------
    // Mettre à jour un utilisateur
    // -----------------------------
    async update(id: string, updates: { username?: string; role_id?: string; plainPassword?: string }): Promise<User | undefined> {
        const user = await db.users.get(id);
        if (!user) return undefined;

        const updatedUser: User = {
            ...user,
            ...updates,
            updated_at: new Date().toISOString(),
            version: user.version + 1,
            sync_status: 'dirty',
            password: updates.plainPassword ? await bcrypt.hash(updates.plainPassword, 10) : user.password
        };

        await db.users.put(updatedUser);
        return updatedUser;
    },

    // -----------------------------
    // Supprimer un utilisateur (soft delete)
    // -----------------------------
    async softDelete(id: string): Promise<User | undefined> {
        const user = await db.users.get(id);
        if (!user) return undefined;

        user.is_deleted = true;
        user.updated_at = new Date().toISOString();
        user.version += 1;
        user.sync_status = 'dirty';

        await db.users.put(user);
        return user;
    },

    // -----------------------------
    // Restaurer un utilisateur supprimé
    // -----------------------------
    async restore(id: string): Promise<User | undefined> {
        const user = await db.users.get(id);
        if (!user) return undefined;

        user.is_deleted = false;
        user.updated_at = new Date().toISOString();
        user.version += 1;
        user.sync_status = 'dirty';

        await db.users.put(user);
        return user;
    },
};
