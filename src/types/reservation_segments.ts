import type { BaseEntity } from './base';

export interface ReservationSegment extends BaseEntity {
  reservation_id: string;
  airline_id?: string;
  system_id?: string;
  ticket_number?: string;
  pnr?: string;
  departure?: string;
  arrival?: string;
  origin?: string;         // ville ou aéroport départ
  destination?: string;    // ville ou aéroport arrivée
  price?: number;
  tax?: number;
  service_fee?: number;
  commission?: number;
  amount_received?: number;
  remaining_amount?: number;
  cancel_price?: number;
}
