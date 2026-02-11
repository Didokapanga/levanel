// src/services/reservationsService.ts
import { db } from '../db/database';
import type { ReservationSegment } from '../types/reservation_segments';
import type { Reservation } from '../types/reservations';
// import type { ReservationStatusType } from '../types/reservationStatus';
import { processReservation } from './reservationWorkflow';

const PAGE_SIZE = 10;

export const reservationsService = {
    async list(page = 1) {
        const offset = (page - 1) * PAGE_SIZE;

        const [data, total] = await Promise.all([
            db.reservations
                .orderBy('created_at')
                .reverse()
                .offset(offset)
                .limit(PAGE_SIZE)
                .toArray(),

            db.reservations.count(),
        ]);

        return {
            data,
            pagination: {
                page,
                pageSize: PAGE_SIZE,
                total,
                totalPages: Math.ceil(total / PAGE_SIZE),
            },
        };
    },

    async getById(id: string) {
        return db.reservations.get(id);
    },

    async create(reservation: Reservation) {
        await db.reservations.add(reservation);
        return reservation;
    },

    async update(id: string, changes: Partial<Reservation>) {
        await db.reservations.update(id, changes);
        return db.reservations.get(id);
    },

    async remove(id: string) {
        await db.reservations.delete(id);
    },

};


/* =========================
   Récupérer toutes les réservations pending
========================= */
export const getPendingReservations = async (): Promise<Reservation[]> => {
    // On récupère toutes les réservations avec status 'pending'
    const pendingReservations: Reservation[] = await db.reservations
        .where('status')
        .equals('pending')
        .toArray();

    return pendingReservations;
};

/* =========================
   Récupérer tous les segments pour une réservation
========================= */
export const getReservationSegments = async (reservationId: string): Promise<ReservationSegment[]> => {
    return await db.reservation_segments
        .where('reservation_id')
        .equals(reservationId)
        .toArray();
};

/* =========================
   Valider une réservation
========================= */
export const validateReservation = async (reservationId: string): Promise<{ success: boolean; message: string }> => {
    // On utilise ton workflow existant
    const validatingUserId = 'current_user_id'; // TODO: remplacer par l'utilisateur connecté
    return await processReservation(reservationId, validatingUserId);
};

/* =========================
   Annuler une réservation
========================= */
export const cancelReservation = async (reservationId: string): Promise<{ success: boolean; message: string }> => {
    const reservation = await db.reservations.get(reservationId);
    if (!reservation) return { success: false, message: 'Réservation introuvable' };

    // Changer le status en cancelled
    reservation.status = 'cancelled';
    await db.reservations.put(reservation);

    return { success: true, message: 'Réservation annulée' };
};
