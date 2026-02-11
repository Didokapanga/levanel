import React, { useState } from 'react';
import { Button } from './Button';
import '../styles/FormEntity.css'

export interface StatusFormData {
    code: string;
    label: string;
    description?: string;
    is_deleted?: boolean;
}

interface FormStatusProps {
    initialData?: Partial<StatusFormData>;
    onSubmit: (data: StatusFormData) => void;
    onCancel: () => void;
}

export const FormStatus: React.FC<FormStatusProps> = ({
    initialData,
    onSubmit,
    onCancel,
}) => {
    const [form, setForm] = useState<StatusFormData>({
        code: initialData?.code ?? '',
        label: initialData?.label ?? '',
        description: initialData?.description ?? '',
        is_deleted: initialData?.is_deleted ?? false,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Code</label>
                <input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="ex: pending"
                    required
                />
            </div>

            <div className="form-group">
                <label>Libellé</label>
                <input
                    name="label"
                    value={form.label}
                    onChange={handleChange}
                    placeholder="En attente"
                    required
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description du status"
                />
            </div>

            <div className="form-actions">
                <Button
                    label="Annuler"
                    variant="secondary"
                    type="button"
                    onClick={onCancel}
                />
                <Button label="Enregistrer" variant="primary" type="submit" />
            </div>
        </form>
    );
};
