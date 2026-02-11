import { db } from '../db/database';

/* ======================================================
   TYPES
====================================================== */
export type WorkflowResult = {
  success: boolean;
  message: string;
};

export interface CancelSegmentData {
  id: string;
  cancel_price: number;
}

/* ======================================================
   PROCESS RESERVATION
====================================================== */
export async function processReservation(
  reservationId: string,
  validatingUserId: string
): Promise<WorkflowResult> {
  let result: WorkflowResult = {
    success: true,
    message: 'Réservation validée avec succès',
  };

  const timestamp = new Date().toISOString();
  const IS_TEST_MODE = true;

  const tableNames = [
    'reservations',
    'reservation_segments',
    'contracts',
    'cautions',
    'stocks',
    'financial_operations',
    'cash_registers',
    'audit_logs',
    'change_logs',
    'sync_state',
    'users',
  ];

  try {
    await db.transaction('rw', tableNames, async () => {
      /* =======================
         DONNÉES DE BASE
      ======================= */
      const reservation = await db.reservations.get(reservationId);
      if (!reservation) {
        result = { success: false, message: 'Réservation introuvable' };
        throw new Error('Abort transaction');
      }

      let user: { id: string };
      if (!IS_TEST_MODE) {
        const dbUser = await db.users.get(validatingUserId);
        if (!dbUser) {
          result = { success: false, message: 'Utilisateur introuvable' };
          throw new Error('Abort transaction');
        }
        user = { id: dbUser.id };
      } else {
        user = { id: 'TEST_USER' };
      }

      if (reservation.status === 'validated') {
        result = { success: false, message: 'Réservation déjà validée' };
        throw new Error('Abort transaction');
      }

      const contract = await db.contracts.get(reservation.contract_id);
      if (!contract) {
        result = { success: false, message: 'Contrat introuvable' };
        throw new Error('Abort transaction');
      }

      const segments = await db.reservation_segments
        .where({ reservation_id: reservationId })
        .toArray();

      const TTC = reservation.total_amount;

      /* =======================
         COUVERTURE FINANCIÈRE
      ======================= */
      let remainingToCover = TTC;

      // --- STOCK PRINCIPAL
      const stock = await db.stocks.where({ contract_id: contract.id }).first();
      if (stock && stock.amount_remaining > 0) {
        const used = Math.min(stock.amount_remaining, remainingToCover);
        const oldValue = stock.amount_remaining;

        stock.amount_remaining -= used;
        remainingToCover -= used;

        await db.stocks.put(stock);

        await db.financial_operations.add({
          id: crypto.randomUUID(),
          reservation_id: reservation.id,
          contract_id: contract.id,
          source: 'stock',
          type: 'deduction',
          amount: used,
          description: `Déduction stock – réservation ${reservation.id}`,
          created_at: timestamp,
          updated_at: timestamp,
          version: 1,
          is_deleted: false,
          sync_status: 'dirty',
        });

        await db.change_logs.add({
          id: crypto.randomUUID(),
          table_name: 'stocks',
          record_id: stock.id,
          column_name: 'amount_remaining',
          old_value: oldValue,
          new_value: stock.amount_remaining,
          user_id: user.id,
          created_at: timestamp,
          updated_at: timestamp,
          version: 1,
          is_deleted: false,
          sync_status: 'dirty',
        });
      }

      // --- CAUTION PRINCIPALE
      const caution = await db.cautions.where({ contract_id: contract.id }).first();
      if (remainingToCover > 0 && caution && caution.amount_remaining > 0) {
        const used = Math.min(caution.amount_remaining, remainingToCover);
        const oldValue = caution.amount_remaining;

        caution.amount_remaining -= used;
        remainingToCover -= used;

        await db.cautions.put(caution);

        await db.financial_operations.add({
          id: crypto.randomUUID(),
          reservation_id: reservation.id,
          contract_id: contract.id,
          source: 'caution',
          type: 'deduction',
          amount: used,
          description: `Déduction caution – réservation ${reservation.id}`,
          created_at: timestamp,
          updated_at: timestamp,
          version: 1,
          is_deleted: false,
          sync_status: 'dirty',
        });

        await db.change_logs.add({
          id: crypto.randomUUID(),
          table_name: 'cautions',
          record_id: caution.id,
          column_name: 'amount_remaining',
          old_value: oldValue,
          new_value: caution.amount_remaining,
          user_id: user.id,
          created_at: timestamp,
          updated_at: timestamp,
          version: 1,
          is_deleted: false,
          sync_status: 'dirty',
        });
      }

      // --- CONTRATS ALTERNATIFS (MÊME PARTENAIRE)
      if (remainingToCover > 0) {
        const fallbackContracts = await db.contracts
          .where({ partner_id: contract.partner_id, status: 'active' })
          .filter(c => c.id !== contract.id)
          .toArray();

        for (const fc of fallbackContracts) {
          if (remainingToCover <= 0) break;

          const fcCaution = await db.cautions
            .where({ contract_id: fc.id })
            .first();

          if (!fcCaution || fcCaution.amount_remaining <= 0) continue;

          const used = Math.min(fcCaution.amount_remaining, remainingToCover);
          const oldValue = fcCaution.amount_remaining;

          fcCaution.amount_remaining -= used;
          remainingToCover -= used;

          await db.cautions.put(fcCaution);

          await db.financial_operations.add({
            id: crypto.randomUUID(),
            reservation_id: reservation.id,
            contract_id: fc.id,
            source: 'caution',
            type: 'deduction',
            amount: used,
            description: `Complément caution contrat ${fc.id} – réservation ${reservation.id}`,
            created_at: timestamp,
            updated_at: timestamp,
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',
          });

          await db.change_logs.add({
            id: crypto.randomUUID(),
            table_name: 'cautions',
            record_id: fcCaution.id,
            column_name: 'amount_remaining',
            old_value: oldValue,
            new_value: fcCaution.amount_remaining,
            user_id: user.id,
            created_at: timestamp,
            updated_at: timestamp,
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',
          });
        }
      }

      if (remainingToCover > 0) {
        result = {
          success: false,
          message: `Fonds insuffisants : solde manquant ${remainingToCover.toFixed(
            2
          )} USD après vérification de tous les contrats actifs du partenaire`,
        };
        throw new Error('Abort transaction');
      }

      /* =======================
         RÉPARTITION PAR SEGMENT
      ======================= */
      const totalSegmentsAmount = segments.reduce(
        (sum, s) => sum + (s.price || 0),
        0
      );

      for (const seg of segments) {
        const segmentPrice = seg.price || 0;
        const paidAmount =
          totalSegmentsAmount > 0
            ? (segmentPrice / totalSegmentsAmount) * TTC
            : 0;

        seg.amount_received = Number(paidAmount.toFixed(2));
        seg.remaining_amount = Math.max(0, segmentPrice - seg.amount_received);

        await db.reservation_segments.put(seg);
      }

      /* =======================
         VALIDATION FINALE
      ======================= */
      reservation.status = 'validated';
      reservation.updated_at = timestamp;
      await db.reservations.put(reservation);

      await db.cash_registers.add({
        id: crypto.randomUUID(),
        direction: 'in',
        amount: TTC,
        currency: 'USD',
        source: 'reservation',
        reference_id: reservation.id,
        contract_id: contract.id,
        description: `Encaissement réservation ${reservation.id}`,
        operation_date: timestamp,
        created_at: timestamp,
        updated_at: timestamp,
        version: 1,
        is_deleted: false,
        sync_status: 'dirty',
      });

      await db.audit_logs.add({
        id: crypto.randomUUID(),
        entity_name: 'reservations',
        entity_id: reservation.id,
        action: 'validate',
        user_id: user.id,
        timestamp,
        details: JSON.stringify({
          total_amount: TTC,
          covered_by_multiple_contracts: true,
        }),
        created_at: timestamp,
        updated_at: timestamp,
        version: 1,
        is_deleted: false,
        sync_status: 'dirty',
      });
    });
  } catch (err) {
    console.error('Erreur processReservation:', err);
    if (!result.message) {
      result = {
        success: false,
        message: 'Erreur lors de la validation de la réservation',
      };
    }
  }

  return result;
}

/* ======================================================
   CANCEL RESERVATION (INCHANGÉ)
====================================================== */
export async function cancelReservation(
  reservationId: string,
  cancelData: CancelSegmentData[],
  cancellingUserId?: string
): Promise<WorkflowResult> {
  let result: WorkflowResult = {
    success: true,
    message: 'Réservation annulée avec succès',
  };

  const timestamp = new Date().toISOString();

  const cancelTables = [
    'reservations',
    'reservation_segments',
    'cash_registers',
    'audit_logs',
    'change_logs',
    'sync_state',
    'users',
  ];

  await db.transaction('rw', cancelTables, async () => {
    const reservation = await db.reservations.get(reservationId);
    if (!reservation) {
      result = { success: false, message: 'Réservation introuvable' };
      throw new Error('Abort transaction');
    }

    const userId = cancellingUserId || 'SYSTEM';

    for (const segData of cancelData) {
      const segment = await db.reservation_segments.get(segData.id);
      if (!segment) continue;

      const oldCancel = segment.cancel_price || 0;
      segment.cancel_price = segData.cancel_price;
      await db.reservation_segments.put(segment);

      await db.change_logs.add({
        id: crypto.randomUUID(),
        table_name: 'reservation_segments',
        record_id: segment.id,
        column_name: 'cancel_price',
        old_value: oldCancel,
        new_value: segment.cancel_price,
        user_id: userId,
        created_at: timestamp,
        updated_at: timestamp,
        version: 1,
        is_deleted: false,
        sync_status: 'dirty',
      });
    }

    reservation.status = 'cancelled';
    reservation.updated_at = timestamp;
    await db.reservations.put(reservation);

    await db.audit_logs.add({
      id: crypto.randomUUID(),
      entity_name: 'reservations',
      entity_id: reservation.id,
      action: 'cancel',
      user_id: userId,
      timestamp,
      details: JSON.stringify(cancelData),
      created_at: timestamp,
      updated_at: timestamp,
      version: 1,
      is_deleted: false,
      sync_status: 'dirty',
    });
  });

  return result;
}
