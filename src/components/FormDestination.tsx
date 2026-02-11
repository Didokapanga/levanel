import React, { useState } from 'react';
import { Button } from './Button';
import '../styles/FormEntity.css';

interface FormDestinationProps {
    onSubmit: (data: { name: string; city: string; country: string; code: string }) => void;
    onCancel?: () => void;
    initialData?: { name: string; city: string; country: string; code: string };
}

export const FormDestination: React.FC<FormDestinationProps> = ({ onSubmit, onCancel, initialData }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [city, setCity] = useState(initialData?.city || '');
    const [country, setCountry] = useState(initialData?.country || '');
    const [code, setCode] = useState(initialData?.code || '');

    return (
        <form
            className="form-entity"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ name, city, country, code });
            }}
        >
            <label>
                Nom
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Charles de Gaulle" required />
            </label>

            <label>
                Ville
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ex: Paris" required />
            </label>

            <label>
                Pays
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Ex: France" required />
            </label>

            <label>
                Code
                <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ex: CDG" required />
            </label>

            <div className="form-actions">
                {onCancel && <Button label="Annuler" variant="secondary" onClick={onCancel} />}
                <Button label="Enregistrer" variant="primary" type="submit" />
            </div>
        </form>
    );
};
