export type SyncStatus = 'clean' | 'dirty' | 'conflict';

export interface SyncState {
  id?: string;                 // UUID
  table_name: string;           // nom de la table synchronisée
  last_synced_at?: string;       // ISO date du dernier sync
  sync_status: SyncStatus;
}
