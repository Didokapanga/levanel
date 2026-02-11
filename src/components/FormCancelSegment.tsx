import React, { useState } from 'react';
import { Button } from './Button';
import '../styles/FormEntity.css'
import type { ReservationSegment } from '../types/reservation_segments';

interface FormCancelSegmentProps {
    segments: ReservationSegment[];
    onSubmit: (data: { id: string; cancel_price: number }[]) => void;
    onCancel?: () => void;
}

export const FormCancelSegment: React.FC<FormCancelSegmentProps> = ({ segments, onSubmit, onCancel }) => {
    const [values, setValues] = useState<Record<string, number>>(
        () => Object.fromEntries(segments.map(s => [s.id, s.cancel_price || 0]))
    );

    const handleChange = (id: string, val: string) => {
        const num = parseFloat(val);
        setValues(prev => ({ ...prev, [id]: isNaN(num) ? 0 : num }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = segments.map(s => ({ id: s.id, cancel_price: values[s.id] || 0 }));
        onSubmit(result);
    };

    return (
        <form className="form-entity" onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold">Annulation des segments</h2>

            {segments.map(s => (
                <label key={s.id}>
                    Segment: {s.pnr || s.ticket_number || s.id}
                    <input
                        type="number"
                        value={values[s.id]}
                        min={0}
                        onChange={e => handleChange(s.id, e.target.value)}
                        placeholder="Montant pénalité / annulation"
                    />
                </label>
            ))}

            <div className="form-actions">
                {onCancel && <Button label="Annuler" variant="secondary" onClick={onCancel} />}
                <Button label="Valider" variant="primary" type="submit" />
            </div>
        </form>
    );
};
