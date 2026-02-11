import React, { useState } from 'react';
import { Button } from './Button';
import '../styles/FormEntity.css';
import type { UserRole } from '../types/roles';

interface FormRoleProps {
    onSubmit: (data: { name: UserRole }) => void;
    onCancel?: () => void;
}

export const FormRole: React.FC<FormRoleProps> = ({ onSubmit, onCancel }) => {
    const [name, setName] = useState<UserRole>('admin');

    return (
        <form
            className="form-entity"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ name });
            }}
        >
            <label>
                Nom du rôle
                <select
                    value={name}
                    onChange={(e) => setName(e.target.value as UserRole)}
                >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="comptable">Comptable</option>
                    <option value="agent">Agent</option>
                </select>
            </label>

            <div className="form-actions">
                {onCancel && (
                    <Button
                        label="Annuler"
                        variant="secondary"
                        onClick={onCancel}
                    />
                )}
                <Button label="Enregistrer" variant="primary" type="submit" />
            </div>
        </form>
    );
};
