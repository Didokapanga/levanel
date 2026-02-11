// src/components/FormAirline.tsx
import React, { useState } from 'react';
import { Button } from './Button';
import '../styles/FormEntity.css';

interface FormAirlineProps {
    onSubmit: (data: { code: string; name: string }) => void; // plus besoin de sync_status
    onCancel?: () => void;
    initialData?: { code: string; name: string };
}

export const FormAirline: React.FC<FormAirlineProps> = ({ onSubmit, onCancel, initialData }) => {
    const [code, setCode] = useState(initialData?.code || '');
    const [name, setName] = useState(initialData?.name || '');

    return (
        <form
            className="form-entity"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ code, name });
            }}
        >
            <label>
                Code
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Ex: AF"
                    required
                    maxLength={5}
                />
            </label>

            <label>
                Nom de la compagnie
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Air France"
                    required
                />
            </label>

            <div className="form-actions">
                {onCancel && <Button label="Annuler" variant="secondary" onClick={onCancel} />}
                <Button label="Enregistrer" variant="primary" type="submit" />
            </div>
        </form>
    );
};
