import React, { useEffect, useState, useMemo } from 'react';
import { Button } from './Button';
import '../styles/FormEntity.css';

import { contractsService } from '../services/contractsService';
import { partnersService } from '../services/partnersService';

import type { Contract } from '../types/contract';
import type { Partner } from '../types/partner';

interface FormCautionProps {
    onSubmit: (data: {
        contract_id: string;
        amount: number;
    }) => void;
    onCancel?: () => void;
}

export const FormCaution: React.FC<FormCautionProps> = ({ onSubmit, onCancel }) => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);

    const [contractId, setContractId] = useState('');
    const [amount, setAmount] = useState(0);

    /** Chargement des données */
    useEffect(() => {
        const loadData = async () => {
            const [contractsList, partnersList] = await Promise.all([
                contractsService.list(),
                partnersService.list(),
            ]);

            // 🔒 Filtre métier STRICT
            const eligibleContracts = contractsList.filter(
                c =>
                    c.status === 'active' &&
                    (c.contract_type === 'caution_only' ||
                        c.contract_type === 'caution_and_stock')
            );

            setContracts(eligibleContracts);
            setPartners(partnersList);
        };

        loadData();
    }, []);

    /** Map partenaire_id → partenaire */
    const partnersMap = useMemo(() => {
        return new Map(partners.map(p => [p.id, p]));
    }, [partners]);

    return (
        <form
            className="form-entity"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({
                    contract_id: contractId,
                    amount,
                });
            }}
        >
            {/* Sélecteur Contrat + Partenaire */}
            <label>
                Contrat / Partenaire
                <select
                    value={contractId}
                    onChange={(e) => setContractId(e.target.value)}
                    required
                >
                    <option value="">— Sélectionner un contrat —</option>

                    {contracts.map(contract => {
                        const partner = partnersMap.get(contract.partner_id);

                        return (
                            <option key={contract.id} value={contract.id}>
                                {partner?.name ?? 'Partenaire inconnu'}
                                {' — '}
                                {contract.contract_type}
                                {' — '}
                                {contract.id.slice(0, 8)}
                            </option>
                        );
                    })}
                </select>
            </label>

            {/* Montant */}
            <label>
                Montant de la caution
                <input
                    type="number"
                    min={0}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
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
                <Button
                    label="Enregistrer"
                    variant="primary"
                    type="submit"
                />
            </div>
        </form>
    );
};
