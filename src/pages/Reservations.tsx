import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, type Column } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { FaCheck, FaPlus } from 'react-icons/fa';

import { FormReservation } from '../components/FormReservation';
import { reservationsService } from '../services/reservationsService';
import type { Reservation } from '../types/reservations';
import type { ReservationInput } from '../models/reservationInput';
import '../styles/Systems.css';

const Reservations: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

    const navigate = useNavigate();

    /* Charger les réservations */
    const loadReservations = async () => {
        const { data } = await reservationsService.list();
        setReservations(data);
    };

    useEffect(() => {
        loadReservations();
    }, []);

    /* Colonnes du tableau */
    const columns: Column<Reservation>[] = [
        { key: 'id', label: 'ID' },
        { key: 'client_name', label: 'Client' },
        { key: 'partner_id', label: 'Partenaire' },
        { key: 'department_id', label: 'Département' },
        { key: 'contract_id', label: 'Contrat' },
        {
            key: 'total_amount',
            label: 'Montant TTC',
            render: (row: Reservation) => `${row.total_amount.toLocaleString()} $`,
        },
        { key: 'date_emission', label: 'Date émission' },
        {
            key: 'status',
            label: 'Statut',
            render: (row: Reservation) => <span className={`badge ${row.status}`}>{row.status}</span>,
        },
    ];

    /* Création ou modification */
    const handleSubmit = async (data: ReservationInput) => {
        const now = new Date().toISOString();

        const reservation: Reservation = {
            ...data,
            id: editingReservation?.id || crypto.randomUUID(),
            created_at: editingReservation?.created_at || now,
            updated_at: now,
            version: editingReservation?.version || 1,
            sync_status: editingReservation?.sync_status || 'dirty',
        };

        if (editingReservation) {
            await reservationsService.update(editingReservation.id, reservation);
        } else {
            await reservationsService.create(reservation);
        }

        setModalOpen(false);
        setEditingReservation(null);
        await loadReservations();
    };

    const handleEdit = (reservation: Reservation) => {
        setEditingReservation(reservation);
        setModalOpen(true);
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Section haute */}
            <div className="actions-bar">
                <div className="actions-left">
                    <h2>Réservations</h2>
                </div>
                <div className="actions-right">
                    <Button
                        label="Validation de réservation"
                        icon={<FaCheck />}
                        variant="info"
                        onClick={() => navigate('/reservation-status')}
                    />
                    <Button
                        label="Créer une réservation"
                        icon={<FaPlus />}
                        variant="primary"
                        onClick={() => {
                            setEditingReservation(null);
                            setModalOpen(true);
                        }}
                    />
                </div>
            </div>

            {/* Tableau */}
            <div className="table-section">
                <Table
                    columns={[
                        ...columns,
                        {
                            key: 'actions',
                            label: 'Actions',
                            render: (row: Reservation) => (
                                <Button label="Modifier" variant="secondary" onClick={() => handleEdit(row)} />
                            ),
                        },
                    ]}
                    data={reservations}
                />
            </div>

            {/* Modal création / édition */}
            <Modal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingReservation(null);
                }}
                title={editingReservation ? 'Modifier la réservation' : 'Nouvelle réservation'}
            >
                <FormReservation
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setModalOpen(false);
                        setEditingReservation(null);
                    }}
                    initialData={editingReservation || { status: 'pending', total_amount: 0 }}
                />
            </Modal>
        </div>
    );
};

export default Reservations;
