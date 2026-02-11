import Dexie from 'dexie';
import type { Table } from 'dexie';

import type { User } from '../types/users';
import type { Department } from '../types/department';
import type { System } from '../types/system';
import type { Airline } from '../types/airline';
import type { PaymentMethod } from '../types/paymentMethod';
import type { Destination } from '../types/destination';
import type { Partner } from '../types/partner';
import type { Contract } from '../types/contract';
import type { Caution } from '../types/caution';
import type { Stock } from '../types/stock';
import type { FinancialOperation } from '../types/financialOperation';
import type { Reservation } from '../types/reservations';
import type { ReservationSegment } from '../types/reservation_segments';
import type { CashRegister } from '../types/cashRegister';
import type { AuditLog } from '../types/auditLog';
import type { ChangeLog } from '../types/changeLog';
import type { SyncState } from '../types/syncState';
import type { Role } from '../types/roles';

export class TravelAgencyDB extends Dexie {
  users!: Table<User, string>;
  departments!: Table<Department, string>;
  systems!: Table<System, string>;

  airlines!: Table<Airline, string>;
  payment_methods!: Table<PaymentMethod, string>;
  destinations!: Table<Destination, string>;
  partners!: Table<Partner, string>;
  contracts!: Table<Contract, string>;
  cautions!: Table<Caution, string>;
  stocks!: Table<Stock, string>;
  financial_operations!: Table<FinancialOperation, string>;
  reservations!: Table<Reservation, string>;
  reservation_segments!: Table<ReservationSegment, string>;
  cash_registers!: Table<CashRegister, string>;
  audit_logs!: Table<AuditLog, string>;
  change_logs!: Table<ChangeLog, string>;
  sync_state!: Table<SyncState, string>;

  roles!: Table<Role, string>;

  constructor() {
    super('travel_agency_db');

    this.version(6).stores({
      users: `
        id,
        username,
        password,
        role_id,
        is_deleted,
        updated_at,
        sync_status
      `,
      departments: `
        id,
        name,
        updated_at,
        sync_status
      `,
      systems: `
        id,
        name,
        updated_at,
        sync_status
      `,
      airlines: `
        id,
        code,
        name,
        updated_at,
        sync_status
      `,
      payment_methods: `
        id,
        label,
        updated_at,
        sync_status
      `,
      destinations: `
        id,
        name,
        city,
        country,
        code,
        updated_at,
        sync_status
      `,
      partners: `
       id,
       name,
       type,
       updated_at,
       sync_status
       `,
      contracts: `
        id,
        partner_id,
        contract_type,
        status,
        start_date,
        end_date,
        updated_at,
        sync_status
        `,
      cautions: `
        id,
        contract_id,
        amount_initial,
        amount_remaining,
        updated_at,
        sync_status
      `,
      stocks: `
        id,
        contract_id,
        amount_initial,
        amount_remaining,
        updated_at,
        sync_status
      `,
      financial_operations: `
        id,
        reservation_id,
        contract_id,
        source,
        type,
        amount,
        created_at,
        updated_at,
        sync_status
      `,
      cash_registers: `
        id,
        direction,
        source,
        reference_id,
        contract_id,
        partner_id,
        amount,
        currency,
        operation_date,
        created_at,
        updated_at,
        version,
        is_deleted,
        sync_status
      `,
      reservations: `
        id,
        partner_id,
        department_id,
        contract_id,
        client_name,
        total_tax,
        total_commission,
        date_emission,
        total_amount,
        payment_method_id,
        receipt_reference,
        observation,
        status,
        created_at,
        updated_at,
        version,
        is_deleted,
        sync_status
      `,
      reservation_segments: `
        id,
        reservation_id,
        airline_id,
        system_id,
        ticket_number,
        pnr,
        departure,
        arrival,
        origin,
        destination,
        price,
        tax,
        service_fee,
        commission,
        amount_received,
        remaining_amount,
        cancel_price,
        updated_at,
        sync_status
      `,
      audit_logs: `
        id,
        entity_name,
        entity_id,
        action,
        user_id,
        timestamp,
        details,
        sync_status
      `,
      change_logs: `
        id,
        table_name,
        record_id,
        column_name,
        old_value,
        new_value,
        updated_at,
        user_id,
        sync_status
      `,
      sync_state: `
        id,
        table_name,
        last_synced_at,
        sync_status
      `,
      roles: `
        id,
        name,
        updated_at,
        sync_status
      `
    });
  }
}

export const db = new TravelAgencyDB();
