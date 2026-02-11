// src/components/FormCashRegister.tsx
import React, { useState } from 'react';
import { Button } from './Button';
import '../styles/FormEntity.css';

import type { CashDirection, CashSource } from '../types/cashRegister';

interface FormCashRegisterProps {
    onSubmit: (data: {
        direction: CashDirection;
        source: CashSource;
        amount: number;
        currency: string;
        description?: string;
    }) => void;
    onCancel?: () => void;
}

export const FormCashRegister: React.FC<FormCashRegisterProps> = ({
    onSubmit,
    onCancel,
}) => {
    const [direction, setDirection] = useState<CashDirection>('in');
    const [source, setSource] = useState<CashSource>('expense');
    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState('USD');
    const [description, setDescription] = useState('');

    return (
        <form
            className="form-entity"
            onSubmit={e => {
                e.preventDefault();
                onSubmit({
                    direction,
                    source,
                    amount,
                    currency,
                    description,
                });
            }}
        >
            <label>
                Sens
                <select value={direction} onChange={e => setDirection(e.target.value as CashDirection)}>
                    <option value="in">Entrée</option>
                    <option value="out">Sortie</option>
                </select>
            </label>

            <label>
                Origine
                <select value={source} onChange={e => setSource(e.target.value as CashSource)}>
                    <option value="expense">Dépense</option>
                    <option value="adjustment">Ajustement</option>
                </select>
            </label>

            <label>
                Montant
                <input
                    type="number"
                    min={0}
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    required
                />
            </label>

            <label>
                Devise
                <select value={currency} onChange={e => setCurrency(e.target.value)}>
                    <option value="USD">USD</option>
                    <option value="CDF">CDF</option>
                </select>
            </label>

            <label>
                Description
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </label>

            <div className="form-actions">
                {onCancel && (
                    <Button label="Annuler" variant="secondary" onClick={onCancel} />
                )}
                <Button label="Enregistrer" variant="primary" type="submit" />
            </div>
        </form>
    );
};
