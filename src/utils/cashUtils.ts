// src/utils/cashUtils.ts
import type { CashRegister } from '../types/cashRegister';

export const computeBalance = (entries: CashRegister[]): number =>
    entries.reduce(
        (total, e) =>
            e.direction === 'in'
                ? total + e.amount
                : total - e.amount,
        0
    );
