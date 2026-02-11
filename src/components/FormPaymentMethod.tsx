import React, { useState } from 'react';
import { Button } from './Button';
import '../styles/FormEntity.css'; // CSS réutilisable pour tous les formulaires

interface FormPaymentMethodProps {
    onSubmit: (data: { label: string }) => void;
    onCancel?: () => void;
    initialData?: { label: string };
}

export const FormPaymentMethod: React.FC<FormPaymentMethodProps> = ({ onSubmit, onCancel, initialData }) => {
    const [label, setLabel] = useState(initialData?.label || '');

    return (
        <form
            className="form-entity"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ label });
            }}
        >
            <label>
                Libellé
                <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Ex: Carte de crédit"
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
