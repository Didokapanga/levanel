import type { BaseEntity } from './base';

export type StockMovementType = 'add' | 'deduction' | 'return';

export interface StockMovement extends BaseEntity {
    stock_id: string;
    reservation_id?: string;     // facultatif
    type: StockMovementType;
    amount: number;
    description?: string;
    created_by?: string;         // user_id
}
