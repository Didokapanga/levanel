// import { BaseEntity } from './base';
import type { BaseEntity } from './base';

export interface Department extends BaseEntity {
  name: string;
  initial?: string;
}
