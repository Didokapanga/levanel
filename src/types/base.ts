export type SyncStatus = 'clean' | 'dirty' | 'conflict';

export interface BaseEntity {
  id: string;               // UUID
  created_at: string;       // ISO date
  updated_at: string;       // ISO date
  version: number;          // increment à chaque modif
  is_deleted: boolean;      // soft delete
  sync_status: SyncStatus;  // état local
}