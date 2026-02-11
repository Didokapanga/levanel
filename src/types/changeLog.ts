import type { BaseEntity } from './base';

export interface ChangeLog extends BaseEntity {
  table_name: string;           // nom de la table modifiée
  record_id: string;            // id de l’enregistrement
  column_name: string;          // champ modifié
  old_value: any;               // valeur avant modification
  new_value: any;               // valeur après modification
  updated_at: string;           // ISO date
  user_id?: string;             // facultatif, qui a changé
  // sync_status: number;          // 0 = non sync, 1 = sync
}
