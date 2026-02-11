import React, { useState } from 'react';
import { Button } from './Button';
import '../styles/FormEntity.css';
import type { PartnerType } from '../types/partner';

interface FormPartnerProps {
    onSubmit: (data: { name: string; type: PartnerType }) => void;
    onCancel?: () => void;
    initialData?: { name: string; type: PartnerType };
}

// Types disponibles pour PartnerType
const partnerTypes: PartnerType[] = ['airline', 'agency', 'supplier', 'other'];

export const FormPartner: React.FC<FormPartnerProps> = ({ onSubmit, onCancel, initialData }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [type, setType] = useState<PartnerType>(initialData?.type || 'agency');

    return (
        <form
            className="form-entity"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ name, type });
            }}
        >
            <label>
                Nom
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Air France"
                    required
                />
            </label>

            <label>
                Type
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as PartnerType)} // ✅ cast vers PartnerType
                >
                    {partnerTypes.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
            </label>

            <div className="form-actions">
                {onCancel && <Button label="Annuler" variant="secondary" onClick={onCancel} />}
                <Button label="Enregistrer" variant="primary" type="submit" />
            </div>
        </form>
    );
};
