import type { ReservationStatusType } from '../types/reservationStatus';

/**
 * Données nécessaires à la création / modification
 * (SANS champs techniques)
 */
export interface ReservationInput {
    partner_id: string;
    department_id: string;
    contract_id: string;

    client_name: string;
    date_emission: string;

    total_amount: number;
    total_commission?: number;
    total_tax?: number;

    payment_method_id?: string;
    receipt_reference?: string;
    observation?: string;

    status: ReservationStatusType;
    is_deleted: boolean;
}
