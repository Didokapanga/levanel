import type { BaseEntity } from './base';

export interface ReservationStatus extends BaseEntity {
  status: ReservationStatusType;
  reservation_id: string;
  updated_at: string;        // ISO date
}

export type ReservationStatusType =
  | 'validated'   // réservation validée
  | 'cancelled'   // annulée
  | 'pending';    // en attente de validation
