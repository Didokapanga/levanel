import React, { useEffect, useMemo, useState } from 'react';
import { Table, type Column } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import FormReservationSegment from '../components/FormReservationSegment';
import { FaPlus } from 'react-icons/fa';
import '../styles/FormEntity.css'

// services
import { reservationSegmentsService } from '../services/reservationSegmentsService';
import { reservationsService } from '../services/reservationsService';

// ✅ IMPORT DU TYPE DOMAINE
import type { ReservationSegment } from '../types/reservation_segments';

/* ================= TYPES ================= */

interface Reservation {
    id: string;
    client_name: string;
}

/* ================= PAGE ================= */

const Segments: React.FC = () => {
    const [segments, setSegments] = useState<ReservationSegment[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [modalOpen, setModalOpen] = useState(false);

    /* ================= LOAD DATA ================= */
    const loadSegments = async () => {
        const data = await reservationSegmentsService.list();
        setSegments(data);
    };

    const loadReservations = async () => {
        const res = await reservationsService.list();
        setReservations(res.data);
    };

    useEffect(() => {
        loadSegments();
        loadReservations();
    }, []);

    /* ================= MAP RESERVATIONS ================= */
    const reservationMap = useMemo(() => {
        const map: Record<string, Reservation> = {};
        reservations.forEach((r) => {
            map[r.id] = r;
        });
        return map;
    }, [reservations]);

    /* ================= COLUMNS ================= */
    const columns: Column<ReservationSegment>[] = [
        {
            key: 'reservation_id',
            label: 'Réservation',
            render: (row) => {
                const reservation = reservationMap[row.reservation_id];
                if (!reservation) return row.reservation_id.slice(0, 8);

                return (
                    <div>
                        <strong>{reservation.client_name}</strong>
                        <div className="text-xs text-gray-500">
                            {reservation.id.slice(0, 8)}
                        </div>
                    </div>
                );
            },
        },
        { key: 'ticket_number', label: 'Billet' },
        { key: 'pnr', label: 'PNR' },
        { key: 'departure', label: 'Départ' },
        { key: 'arrival', label: 'Arrivée' },
        {
            key: 'price',
            label: 'Prix billet',
            render: (r) => `${r.price ?? 0} $`,
        },
        {
            key: 'tax',
            label: 'Taxes',
            render: (r) => `${r.tax ?? 0} $`,
        },
        {
            key: 'service_fee',
            label: 'Frais service',
            render: (r) => `${r.service_fee ?? 0} $`,
        },
        {
            key: 'commission',
            label: 'Commission',
            render: (r) => `${r.commission ?? 0} $`,
        },
        {
            key: 'amount_received',
            label: 'Reçu',
            render: (r) => `${r.amount_received ?? 0} $`,
        },
        {
            key: 'remaining_amount',
            label: 'Reste',
            render: (r) => (
                <span
                    className={
                        r.remaining_amount && r.remaining_amount > 0
                            ? 'text-red-600 font-semibold'
                            : 'text-green-600'
                    }
                >
                    {r.remaining_amount ?? 0} $
                </span>
            ),
        },
        {
            key: 'sync_status',
            label: 'Sync',
            render: (r) => {
                let colorClass = '';
                switch (r.sync_status) {
                    case 'clean':
                        colorClass = 'bg-green-100 text-green-800';
                        break;
                    case 'dirty':
                        colorClass = 'bg-orange-100 text-orange-800';
                        break;
                    case 'conflict':
                        colorClass = 'bg-red-100 text-red-800';
                        break;
                }

                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
                        {r.sync_status}
                    </span>
                );
            },
        },
    ];

    /* ================= RENDER ================= */
    return (
        <div className="flex flex-col h-full space-y-4">
            {/* HEADER */}
            <div className="actions-bar">
                <div className="actions-left">
                    <h2>Segments de réservation</h2>
                </div>
                <div className="actions-right">
                    <Button
                        label="Créer un segment"
                        icon={<FaPlus />}
                        variant="primary"
                        onClick={() => setModalOpen(true)}
                    />
                </div>
            </div>

            {/* TABLE */}
            <div className="table-section">
                <Table columns={columns} data={segments} />
            </div>

            {/* MODAL */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Nouveau segment de réservation"
            >
                <FormReservationSegment
                    onSubmit={(data) => {
                        const now = new Date().toISOString();

                        const segment: ReservationSegment = {
                            ...data,
                            id: crypto.randomUUID(),
                            created_at: now,
                            updated_at: now,
                            version: 1,
                            is_deleted: false,
                            sync_status: 'dirty',
                            reservation_id: data.reservation_id!,
                            origin: data.origin,        // <--- explicitement
                            destination: data.destination, // <--- explicitement
                        };

                        reservationSegmentsService.create(segment).then(() => {
                            loadSegments();
                            setModalOpen(false);
                        });
                    }}
                    onCancel={() => setModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default Segments;
