import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import '../styles/FormEntity.css';

import { rolesService } from '../services/rolesService';

import type { Role } from '../types/roles';

/* =========================
   Types
   ========================= */

export interface FormUserData {
    username: string;
    role_id: string;
    password: string; // ✅ nouveau champ
}

export interface FormUserProps {
    onSubmit: (data: FormUserData) => void;
    onCancel?: () => void;
    initialData?: FormUserData;
}

export const FormUser: React.FC<FormUserProps> = ({
    onSubmit,
    onCancel,
    initialData,
}) => {
    const [username, setUsername] = useState(initialData?.username ?? '');
    const [roleId, setRoleId] = useState(initialData?.role_id ?? '');
    const [password, setPassword] = useState(initialData?.password ?? ''); // ✅
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const rolesList = await rolesService.list();
                setRoles(rolesList);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="form-loading">Chargement…</div>;

    return (
        <form
            className="form-entity"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ username, role_id: roleId, password }); // ✅ passe le mot de passe
            }}
        >
            <label>
                Nom d’utilisateur
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ex: jdoe"
                    required
                />
            </label>

            <label>
                Rôle
                <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    required
                >
                    <option value="">-- Sélectionner un rôle --</option>
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Mot de passe
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    required
                />
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
