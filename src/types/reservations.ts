import type { BaseEntity } from './base';
import type { ReservationStatusType } from './reservationStatus';

export interface Reservation extends BaseEntity {
  partner_id: string;
  department_id: string;
  contract_id: string;
  client_name: string;
  date_emission: string;

  total_amount: number;      // TTC
  total_commission?: number;
  total_tax?: number;

  payment_method_id?: string;
  receipt_reference?: string;
  observation?: string;

  status: ReservationStatusType;
}

