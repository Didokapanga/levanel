// src/services/reservationSegmentsService.ts
import { db } from '../db/database';
import type { ReservationSegment } from '../types/reservation_segments';
import { generateUUID } from '../utils/uuid';

const PAGE_SIZE = 10;

export const reservationSegmentsService = {

    /**
 * Lister tous les segments (page globale)
 */
    async list() {
        return db.reservation_segments.toArray();
    },
    /**
     * Lister les segments d'une réservation
     */
    async listByReservation(
        reservationId: string,
        page = 1
    ) {
        const offset = (page - 1) * PAGE_SIZE;

        const collection = db.reservation_segments
            .where('reservation_id')
            .equals(reservationId);

        const [data, total] = await Promise.all([
            collection
                .offset(offset)
                .limit(PAGE_SIZE)
                .toArray(),

            collection.count(),
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

    /**
     * Récupérer un segment par ID
     */
    async getById(id: string) {
        return db.reservation_segments.get(id);
    },

    /**
     * Créer un segment
     */
    async create(data: Partial<ReservationSegment>) {
        const now = new Date().toISOString();

        const segment: ReservationSegment = {
            id: generateUUID(),                 // ✅ clé primaire
            created_at: now,
            updated_at: now,
            version: 1,
            is_deleted: false,
            sync_status: 'dirty',               // état initial local

            // données métier
            reservation_id: data.reservation_id!,
            airline_id: data.airline_id,
            system_id: data.system_id,
            ticket_number: data.ticket_number,
            pnr: data.pnr,

            // dates converties en ISO string
            departure: data.departure ? new Date(data.departure).toISOString() : undefined,
            arrival: data.arrival ? new Date(data.arrival).toISOString() : undefined,

            // destinations
            origin: data.origin || undefined,
            destination: data.destination || undefined,

            // financier
            price: data.price,
            tax: data.tax,
            service_fee: data.service_fee,
            commission: data.commission,
            amount_received: data.amount_received,
            remaining_amount: data.remaining_amount,
            cancel_price: data.cancel_price,
        };

        await db.reservation_segments.add(segment);
        return segment;
    },

    /**
     * Mettre à jour un segment
     */
    async update(
        id: string,
        changes: Partial<ReservationSegment>
    ) {
        await db.reservation_segments.update(id, changes);
        return db.reservation_segments.get(id);
    },

    /**
     * Supprimer un segment
     */
    async remove(id: string) {
        await db.reservation_segments.delete(id);
    },

    /**
     * Supprimer tous les segments d'une réservation
     * (utile en cas d'annulation complète)
     */
    async removeByReservation(reservationId: string) {
        const segments = await db.reservation_segments
            .where('reservation_id')
            .equals(reservationId)
            .toArray();

        const ids = segments.map(s => s.id);
        await db.reservation_segments.bulkDelete(ids);
    },
};
