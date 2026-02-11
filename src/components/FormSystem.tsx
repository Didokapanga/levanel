import React, { useState } from 'react';
import { Button } from './Button';
import '../styles/FormSystem.css';

interface FormSystemProps {
    onSubmit: (data: { name: string }) => void; // plus de sync_status
    onCancel?: () => void;
    initialData?: { name: string };
}

export const FormSystem: React.FC<FormSystemProps> = ({ onSubmit, onCancel, initialData }) => {
    const [name, setName] = useState(initialData?.name || '');

    return (
        <form
            className="form-system"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ name });
            }}
        >
            <label>
                Nom du système
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom du système..."
                />
            </label>

            <div className="form-actions">
                {onCancel && <Button label="Annuler" variant="secondary" onClick={onCancel} />}
                <Button label="Enregistrer" variant="primary" type="submit" />
            </div>
        </form>
    );
};
