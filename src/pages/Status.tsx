import React, { useState, useEffect } from 'react';
import { ReservationCard } from '../components/ReservationCard';
import { Modal } from '../components/Modal';
import { FormCancelSegment } from '../components/FormCancelSegment';
import type { Reservation } from '../types/reservations';
import type { ReservationSegment } from '../types/reservation_segments';
import '../styles/FormEntity.css'
import { getPendingReservations, getReservationSegments, validateReservation } from '../services/reservationsService';
import { cancelReservation as cancelWorkflow } from '../services/reservationWorkflow';

const Status: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [segmentsMap, setSegmentsMap] = useState<Record<string, ReservationSegment[]>>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [currentResId, setCurrentResId] = useState<string | null>(null);

    const loadReservations = async () => {
        const res = await getPendingReservations();
        setReservations(res);

        const map: Record<string, ReservationSegment[]> = {};
        for (const r of res) {
            map[r.id] = await getReservationSegments(r.id);
        }
        setSegmentsMap(map);
    };

    useEffect(() => {
        loadReservations();
    }, []);

    const handleValidate = async (id: string) => {
        await validateReservation(id);
        await loadReservations();
    };

    const handleCancelClick = (id: string) => {
        setCurrentResId(id);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setCurrentResId(null);
    };

    return (
        <div className="reservations-container">
            {reservations.map((res) => (
                <ReservationCard
                    key={res.id}
                    reservation={res}
                    segments={segmentsMap[res.id] || []}
                    onValidate={handleValidate}
                    onCancel={() => handleCancelClick(res.id)}
                />
            ))}


            <Modal isOpen={modalOpen} onClose={handleModalClose} title="Annulation réservation">
                {currentResId && segmentsMap[currentResId] && (
                    <FormCancelSegment
                        segments={segmentsMap[currentResId]}
                        onSubmit={async (cancelData) => {
                            await cancelWorkflow(currentResId!, cancelData, 'current_user_id');
                            await loadReservations();
                            setModalOpen(false);
                            setCurrentResId(null);
                        }}
                        onCancel={() => setModalOpen(false)}
                    />
                )}
            </Modal>

        </div>
    );
};

export default Status;
