import type { BaseEntity } from './base';

export interface User extends BaseEntity {
  username: string;
  role_id: string;
  password: string; // le mot de passe hashé
}
