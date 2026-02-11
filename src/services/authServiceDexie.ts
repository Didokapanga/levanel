import bcrypt from 'bcryptjs';
import { db } from '../db/database';
import type { User } from '../types/users';

export const authServiceDexie = {
    getCurrentUser: (): User | null => {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    login: async (username: string, password: string): Promise<User | null> => {
        const user = await db.users.get({ username });
        if (!user) return null;

        // Compare le mot de passe en clair avec le hash
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) return null;

        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    },

    logout: () => {
        localStorage.removeItem('currentUser');
    }
};
