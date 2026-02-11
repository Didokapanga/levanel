import type { BaseEntity } from './base';

export type UserRole = 'admin' | 'manager' | 'comptable' | 'agent';

export interface Role extends BaseEntity {
    name: UserRole;         // ex: 'manager', 'comptable'
    description?: string;
}
