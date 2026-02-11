// FormContract.tsx
import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import '../styles/FormEntity.css';

import { partnersService } from '../services/partnersService';
import type { Partner } from '../types/partner';
import type { ContractType } from '../types/contract';

interface FormContractProps {
    onSubmit: (data: {
        partner_id: string;
        contract_type: ContractType;
        start_date: string;
        end_date?: string;
        description?: string;
    }) => void;
    onCancel?: () => void;
}


// Types de contrat possibles
const contractTypes: { value: ContractType; label: string }[] = [
    { value: 'agency_service', label: 'Contrat d’agence' },
    { value: 'caution_only', label: 'Caution seule' },
    { value: 'caution_and_stock', label: 'Caution + Stock' },
];

// const contractStatus = ['active', 'inactive', 'expired', 'exhausted'];

export const FormContract: React.FC<FormContractProps> = ({
    onSubmit,
    onCancel,
}) => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [partnerId, setPartnerId] = useState<string>('');
    const [contractType, setContractType] =
        useState<ContractType>('agency_service');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');

    /* =========================
       Chargement des partenaires
       ========================= */
    useEffect(() => {
        partnersService.list().then(setPartners);
    }, []);

    return (
        <form
            className="form-entity"
            onSubmit={(e) => {
                e.preventDefault();

                onSubmit({
                    partner_id: partnerId,
                    contract_type: contractType,
                    start_date: startDate,
                    end_date: endDate || undefined,
                    description: description || undefined,
                });
            }}
        >
            {/* Partenaire */}
            <label>
                Partenaire
                <select
                    value={partnerId}
                    onChange={(e) => setPartnerId(e.target.value)}
                    required
                >
                    <option value="">— Sélectionner un partenaire —</option>
                    {partners.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </label>

            {/* Type de contrat */}
            <label>
                Type de contrat
                <select
                    value={contractType}
                    onChange={(e) =>
                        setContractType(e.target.value as ContractType)
                    }
                >
                    {contractTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                            {t.label}
                        </option>
                    ))}
                </select>
            </label>

            {/* Dates */}
            <label>
                Date de début
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
            </label>

            <label>
                Date de fin (optionnelle)
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </label>

            {/* Description */}
            <label>
                Description
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>

            <div className="form-actions">
                {onCancel && (
                    <Button label="Annuler" variant="secondary" onClick={onCancel} />
                )}
                <Button label="Créer le contrat" variant="primary" type="submit" />
            </div>
        </form>
    );
};
