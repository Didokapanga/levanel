import type {
    ReservationStatus,
    ReservationStatusType,
} from '../types/reservationStatus';

/* =========================
   Stockage temporaire
========================= */

const reservationStatusStore: Record<
    number,
    ReservationStatus[]
> = {};

/* =========================
   Commands
========================= */

export const addReservationStatus = async (
    reservationId: number,
    status: ReservationStatusType
): Promise<ReservationStatus> => {
    const now = new Date().toISOString();

    const entry: ReservationStatus = {
        id: crypto.randomUUID(),
        status,
        created_at: now,
        updated_at: now,
        version: 1,
        sync_status: 'dirty',   // <-- 'dirty' au lieu de 'pending'
        is_deleted: false,
    };

    if (!reservationStatusStore[reservationId]) {
        reservationStatusStore[reservationId] = [];
    }

    reservationStatusStore[reservationId].push(entry);

    return entry;
};

/* =========================
   Queries
========================= */

export const getReservationStatusHistory = async (
    reservationId: number
): Promise<ReservationStatus[]> => {
    return (
        reservationStatusStore[reservationId]?.filter(
            (s) => !s.is_deleted
        ) ?? []
    );
};

export const getCurrentReservationStatus = async (
    reservationId: number
): Promise<ReservationStatusType> => {
    const history = await getReservationStatusHistory(reservationId);

    return history.length
        ? history[history.length - 1].status
        : 'pending';
};
