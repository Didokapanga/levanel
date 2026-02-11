// import React, { useEffect } from 'react';
// import { processReservation } from '../services/reservationWorkflow';
// import { db } from '../db/database';
// import { seedDB } from '../services/seed';

// function App() {
//     useEffect(() => {
//         async function runTest() {
//             // 1️⃣ Seed des données de test
//             await seedDB();

//             // 2️⃣ Récupérer un user manager pour le test
//             const user = await db.users.where('username').equals('Alice').first();
//             if (!user) return console.error('Utilisateur test introuvable');

//             // 3️⃣ Créer une réservation de test si nécessaire
//             const reservationId = 'reservation-1';
//             await db.reservations.put({
//                 id: reservationId,
//                 partner_id: 'partner-1',
//                 department_id: 'dep-1',
//                 contract_id: 'contract-1',
//                 client_name: 'Client Test',
//                 date_emission: new Date().toISOString(),
//                 total_amount: 300,
//                 status: 'pending',
//                 created_at: new Date().toISOString(),
//                 updated_at: new Date().toISOString(),
//                 version: 1,
//                 is_deleted: false,
//                 sync_status: 'clean',
//             });

//             // 4️⃣ Appeler le workflow
//             const result = await processReservation(reservationId, user.id);
//             console.log('Résultat du workflow:', result);

//             // 5️⃣ Vérifier l'état de la base
//             const cautions = await db.cautions.toArray();
//             const stocks = await db.stocks.toArray();
//             const finOps = await db.financial_operations.toArray();
//             const statuses = await db.reservation_statuses.toArray();

//             console.log('Cautions:', cautions);
//             console.log('Stocks:', stocks);
//             console.log('FinancialOperations:', finOps);
//             console.log('ReservationStatus:', statuses);
//         }

//         runTest();
//     }, []);

//     return <div>Check console for test results </div>;
// }

// export default App;
