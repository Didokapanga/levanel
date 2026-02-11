import type { BaseEntity } from './base';

export interface PaymentMethod extends BaseEntity {
  label: string;     // Cash, Mobile Money, Carte, etc.
}
