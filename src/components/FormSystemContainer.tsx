// src/components/FormSystemContainer.tsx
import React from 'react';
import { FormSystem } from './FormSystem';
import { systemsService } from '../services/systemsService';
import type { System } from '../types/system';

interface FormSystemContainerProps {
    initialData?: { name: string; sync_status: 'synced' | 'pending' | 'failed' };
    onSuccess?: (system: System) => void; // callback après création
    onCancel?: () => void;
}

export const FormSystemContainer: React.FC<FormSystemContainerProps> = ({
    initialData,
    onSuccess,
    onCancel,
}) => {
    // onSubmit ne reçoit que le champ 'name'
    const handleSubmit = async (data: { name: string }) => {
        try {
            // Ajouter sync_status côté container
            const payload = {
                name: data.name,
                sync_status: 'pending' as const,
            };

            const system = await systemsService.create(payload.name); // create peut utiliser payload.name
            console.log('Système créé ✅', system);

            if (onSuccess) onSuccess(system);
        } catch (err) {
            console.error('Erreur lors de la création du système', err);
        }
    };

    return (
        <FormSystem
            onSubmit={handleSubmit}
            onCancel={onCancel}
            initialData={initialData}
        />
    );
};
