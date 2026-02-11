// src/models/financialOperationInput.ts

import type { FinancialOperation } from "../types/financialOperation";

export type FinancialOperationInput = Omit<
    FinancialOperation,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'version'
    | 'sync_status'
    | 'is_deleted'
>;
