import type { BaseEntity } from './base';

export type MovementType = 'deposit' | 'deduction' | 'refund';

export interface CautionMovement extends BaseEntity {
    caution_id: string;
    reservation_id?: string;     // facultatif si lié à une réservation
    type: MovementType;
    amount: number;
    description?: string;
    created_by?: string;         // user_id
}
