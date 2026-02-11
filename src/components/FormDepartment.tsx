import React, { useState } from 'react';
import { Button } from './Button';
import '../styles/FormEntity.css';

interface FormDepartmentProps {
    onSubmit: (data: { name: string }) => void;
    onCancel?: () => void;
    initialData?: { name: string };
}

export const FormDepartment: React.FC<FormDepartmentProps> = ({ onSubmit, onCancel, initialData }) => {
    const [name, setName] = useState(initialData?.name || '');

    return (
        <form
            className="form-entity"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ name });
            }}
        >
            <label>
                Nom du département
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Billetterie"
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
