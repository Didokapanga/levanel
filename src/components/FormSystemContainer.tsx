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

    const handleSubmit = async (data: { name: string; sync_status: 'synced' | 'pending' | 'failed' }) => {
        try {
            const system = await systemsService.create(data.name);
            console.log('Système créé ✅', system);

            if (onSuccess) onSuccess(system);
        } catch (err) {
            console.error('Erreur lors de la création du système', err);
        }
    };

    return <FormSystem onSubmit={handleSubmit} onCancel={onCancel} initialData={initialData} />;
};
