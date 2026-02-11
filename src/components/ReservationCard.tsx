import React from 'react';
import { Button } from './Button';
import '../styles/ReservationCard.css';
import type { Reservation } from '../types/reservations';
import type { ReservationSegment } from '../types/reservation_segments';

interface ReservationCardProps {
    reservation: Reservation;
    segments: ReservationSegment[];
    onValidate: (id: string) => void;
    onCancel: (id: string) => void;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
    reservation,
    segments,
    onValidate,
    onCancel,
}) => {
    const totalReceived = segments.reduce((sum, s) => sum + (s.amount_received || 0), 0);
    const totalRemaining = segments.reduce((sum, s) => sum + (s.remaining_amount || 0), 0);

    return (
        <div className="reservation-card">
            <div className="reservation-header">
                <h3>{reservation.client_name}</h3>
                <span className={`status-badge ${reservation.status}`}>{reservation.status}</span>
            </div>

            <div className="reservation-body">
                <div className="reservation-info">
                    <p><strong>Date émission:</strong> {new Date(reservation.date_emission).toLocaleDateString()}</p>
                    <p><strong>Montant total:</strong> {reservation.total_amount.toFixed(2)} USD</p>
                    {reservation.total_commission && <p><strong>Commission:</strong> {reservation.total_commission.toFixed(2)}</p>}
                    {reservation.total_tax && <p><strong>Taxe:</strong> {reservation.total_tax.toFixed(2)}</p>}
                </div>

                <div className="segments-list">
                    <h4>Segments</h4>
                    {segments.map((seg) => (
                        <div key={seg.id} className="segment-item">
                            <p><strong>PNR:</strong> {seg.pnr || '-'}</p>
                            <p><strong>Vol:</strong> {seg.departure} → {seg.arrival}</p>
                            <p><strong>Prix:</strong> {seg.price?.toFixed(2) || 0} USD</p>
                            <p><strong>Reçu:</strong> {seg.amount_received?.toFixed(2) || 0} USD</p>
                            <p><strong>Restant:</strong> {seg.remaining_amount?.toFixed(2) || 0} USD</p>
                        </div>
                    ))}
                </div>

                <div className="totals">
                    <p><strong>Total reçu:</strong> {totalReceived.toFixed(2)} USD</p>
                    <p><strong>Total restant:</strong> {totalRemaining.toFixed(2)} USD</p>
                </div>
            </div>

            <div className="reservation-actions">
                <Button label="Valider" variant="primary" onClick={() => onValidate(reservation.id)} />
                <Button label="Annuler" variant="secondary" onClick={() => onCancel(reservation.id)} />
            </div>
        </div>
    );
};
