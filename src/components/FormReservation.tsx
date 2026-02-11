import React, { useEffect, useMemo, useState } from 'react';
import { Button } from './Button';
import '../styles/FormEntity.css';

import type { ReservationInput } from '../models/reservationInput';
import type { ReservationStatusType } from '../types/reservationStatus';
import type { Partner } from '../types/partner';
import type { Department } from '../types/department';
import type { Contract } from '../types/contract';
import type { PaymentMethod } from '../types/paymentMethod';

import { partnersService } from '../services/partnersService';
import { departmentsService } from '../services/departmentsService';
import { contractsService } from '../services/contractsService';
import { paymentMethodsService } from '../services/paymentMethodsService';

interface FormReservationProps {
    onSubmit: (data: ReservationInput) => void;
    onCancel?: () => void;
    initialData?: Partial<ReservationInput>;
}

export const FormReservation: React.FC<FormReservationProps> = ({
    onSubmit,
    onCancel,
    initialData,
}) => {
    /* =========================
       State formulaire
    ========================= */

    const [partnerId, setPartnerId] = useState(initialData?.partner_id ?? '');
    const [departmentId, setDepartmentId] = useState(initialData?.department_id ?? '');
    const [contractId, setContractId] = useState(initialData?.contract_id ?? '');

    const [clientName, setClientName] = useState(initialData?.client_name ?? '');
    const [dateEmission, setDateEmission] = useState(initialData?.date_emission ?? '');

    const [totalAmount, setTotalAmount] = useState(initialData?.total_amount ?? 0);
    const [totalCommission, setTotalCommission] = useState<number | undefined>(
        initialData?.total_commission
    );
    const [totalTax, setTotalTax] = useState<number | undefined>(
        initialData?.total_tax
    );

    const [paymentMethodId, setPaymentMethodId] = useState(
        initialData?.payment_method_id ?? ''
    );

    const [receiptReference, setReceiptReference] = useState(
        initialData?.receipt_reference ?? ''
    );

    const [observation, setObservation] = useState(initialData?.observation ?? '');

    const [status, setStatus] = useState<ReservationStatusType>(
        initialData?.status ?? 'pending'
    );

    /* =========================
       Données référentielles
    ========================= */

    const [partners, setPartners] = useState<Partner[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

    useEffect(() => {
        const loadData = async () => {
            setPartners(await partnersService.list());
            setDepartments(await departmentsService.list());
            setContracts(await contractsService.list());
            setPaymentMethods(await paymentMethodsService.list());
        };

        loadData();
    }, []);

    /* =========================
       Règles métier
    ========================= */

    const availableContracts = useMemo(() => {
        return contracts.filter(
            (c) =>
                c.partner_id === partnerId &&
                c.status === 'active' &&
                !c.is_deleted
        );
    }, [contracts, partnerId]);

    const noActiveContract =
        partnerId !== '' && availableContracts.length === 0;

    useEffect(() => {
        if (!availableContracts.some((c) => c.id === contractId)) {
            setContractId('');
        }
    }, [availableContracts, contractId]);

    /* =========================
       Submit
    ========================= */

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSubmit({
            partner_id: partnerId,
            department_id: departmentId,
            contract_id: contractId,
            client_name: clientName,
            date_emission: dateEmission,
            total_amount: totalAmount,
            total_commission: totalCommission,
            total_tax: totalTax,
            payment_method_id: paymentMethodId || undefined,
            receipt_reference: receiptReference || undefined,
            observation: observation || undefined,
            status,
            is_deleted: false,
        });
    };

    /* =========================
       Render
    ========================= */

    return (
        <form className="form-entity" onSubmit={handleSubmit}>
            <label>
                Client
                <input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                />
            </label>

            <label>
                Partenaire
                <select
                    value={partnerId}
                    onChange={(e) => setPartnerId(e.target.value)}
                    required
                >
                    <option value="">-- Sélectionner --</option>
                    {partners.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Contrat
                <select
                    value={contractId}
                    onChange={(e) => setContractId(e.target.value)}
                    disabled={noActiveContract}
                    required
                >
                    <option value="">-- Sélectionner --</option>
                    {availableContracts.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.contract_type}
                        </option>
                    ))}
                </select>
            </label>

            {noActiveContract && (
                <small className="text-danger">
                    Aucun contrat actif pour ce partenaire
                </small>
            )}

            <label>
                Département
                <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    required
                >
                    <option value="">-- Sélectionner --</option>
                    {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.name}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Date émission
                <input
                    type="date"
                    value={dateEmission}
                    onChange={(e) => setDateEmission(e.target.value)}
                    required
                />
            </label>

            <label>
                Moyen de paiement
                <select
                    value={paymentMethodId}
                    onChange={(e) => setPaymentMethodId(e.target.value)}
                >
                    <option value="">-- Sélectionner --</option>
                    {paymentMethods.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.label}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Montant total
                <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    required
                />
            </label>

            <label>
                Commission
                <input
                    type="number"
                    value={totalCommission ?? ''}
                    onChange={(e) =>
                        setTotalCommission(
                            e.target.value ? Number(e.target.value) : undefined
                        )
                    }
                />
            </label>

            <label>
                Taxe
                <input
                    type="number"
                    value={totalTax ?? ''}
                    onChange={(e) =>
                        setTotalTax(e.target.value ? Number(e.target.value) : undefined)
                    }
                />
            </label>

            <label>
                Statut
                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value as ReservationStatusType)
                    }
                >
                    <option value="pending">Pending</option>
                    <option value="validated">Validated</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </label>

            <label>
                Référence reçu
                <input
                    value={receiptReference}
                    onChange={(e) => setReceiptReference(e.target.value)}
                />
            </label>

            <label>
                Observation
                <textarea
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
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
                    disabled={noActiveContract}
                />
            </div>
        </form>
    );
};
