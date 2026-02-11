// src/components/FormFinancialOperation.tsx
import React, { useState } from 'react';
import type { OperationSource, OperationType } from '../types/financialOperation';
import type { FinancialOperationInput } from '../models/financialOperationInput';
import '../styles/FormEntity.css';

interface FormFinancialOperationProps {
    onSubmit: (data: FinancialOperationInput) => void;
    onCancel?: () => void;
    initialData?: Partial<FinancialOperationInput>;
}

const FormFinancialOperation: React.FC<FormFinancialOperationProps> = ({
    onSubmit,
    onCancel,
    initialData,
}) => {
    const [reservationId, setReservationId] = useState<string>(
        initialData?.reservation_id ?? ''
    );

    const [contractId, setContractId] = useState<string>(
        initialData?.contract_id ?? ''
    );

    const [source, setSource] = useState<OperationSource>(
        initialData?.source ?? 'caution'
    );

    const [type, setType] = useState<OperationType>(
        initialData?.type ?? 'deduction'
    );

    const [amount, setAmount] = useState<number>(
        initialData?.amount ?? 0
    );

    const [description, setDescription] = useState<string>(
        initialData?.description ?? ''
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: FinancialOperationInput = {
            reservation_id: reservationId || undefined,
            contract_id: contractId || undefined,
            source,
            type,
            amount,
            description: description || undefined,
            // is_deleted: false, // 🔥 OBLIGATOIRE (BaseInput)
        };

        onSubmit(payload);
    };

    return (
        <form className="form-entity" onSubmit={handleSubmit}>
            <h2 className="form-title">Nouvelle opération financière</h2>

            <div className="form-group">
                <label>ID réservation</label>
                <input
                    type="text"
                    placeholder="Optionnel"
                    value={reservationId}
                    onChange={(e) => setReservationId(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>ID contrat</label>
                <input
                    type="text"
                    placeholder="Optionnel"
                    value={contractId}
                    onChange={(e) => setContractId(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Source</label>
                <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as OperationSource)}
                >
                    <option value="caution">Caution</option>
                    <option value="stock">Stock</option>
                    <option value="cash_register">Caisse</option>
                </select>
            </div>

            <div className="form-group">
                <label>Type d’opération</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as OperationType)}
                >
                    <option value="deduction">Déduction</option>
                    <option value="refund">Remboursement</option>
                    <option value="payment">Paiement</option>
                </select>
            </div>

            <div className="form-group">
                <label>Montant</label>
                <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    placeholder="Description optionnelle"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="btn primary">
                    Enregistrer
                </button>
                {onCancel && (
                    <button type="button" className="btn secondary" onClick={onCancel}>
                        Annuler
                    </button>
                )}
            </div>
        </form>
    );
};

export default FormFinancialOperation;
