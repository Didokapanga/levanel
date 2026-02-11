import type { BaseEntity } from './base';

export interface Destination extends BaseEntity {
  name: string;          // Nom principal
  city?: string;
  country?: string;
  code?: string;         // code aéroport / destination
  description?: string;
}
