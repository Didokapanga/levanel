// // seed.ts
// import { db } from '../db/database';
// import { v4 as uuid } from 'uuid';

// export async function seedDB() {
//   // Roles
//   await db.roles.bulkPut([
//     { id: uuid(), name: 'manager', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), version: 1, is_deleted: false, sync_status: 'clean' },
//     { id: uuid(), name: 'comptable', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), version: 1, is_deleted: false, sync_status: 'clean' },
//   ]);

//   // Users
//   await db.users.bulkPut([
//     { id: uuid(), username: 'Alice', role_id: 'id-manager', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), version: 1, is_deleted: false, sync_status: 'clean' },
//     { id: uuid(), username: 'Bob', role_id: 'id-comptable', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), version: 1, is_deleted: false, sync_status: 'clean' },
//   ]);

//   // Cautions
//   await db.cautions.bulkPut([
//     { id: uuid(), contract_id: 'contract-1', amount_initial: 1000, amount_remaining: 1000, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), version: 1, is_deleted: false, sync_status: 'clean' },
//   ]);

//   // Stock
//   await db.stocks.bulkPut([
//     { id: uuid(), contract_id: 'contract-1', amount_initial: 500, amount_remaining: 500, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), version: 1, is_deleted: false, sync_status: 'clean' },
//   ]);

//   console.log('Database seeded!');
// }
