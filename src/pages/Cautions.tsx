import React from 'react';
import { Table, type Column } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { FormCaution } from '../components/FormCaution';
import { FaPlus } from 'react-icons/fa';
import '../styles/Systems.css';

import { cautionsService } from '../services/cautionsService';
import type { Caution } from '../types/caution';
import type { Contract } from '../types/contract';
import type { Partner } from '../types/partner';
import { contractsService } from '../services/contractsService';
import { partnersService } from '../services/partnersService';

const Cautions: React.FC = () => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [cautions, setCautions] = React.useState<Caution[]>([]);
    const [contracts, setContracts] = React.useState<Contract[]>([]);
    const [partners, setPartners] = React.useState<Partner[]>([]);


    React.useEffect(() => {
        cautionsService.list().then(setCautions);
        contractsService.list().then(setContracts);
        partnersService.list().then(setPartners);
    }, []);

    const contractsMap = React.useMemo(() => {
        return new Map(contracts.map(c => [c.id, c]));
    }, [contracts]);

    const partnersMap = React.useMemo(() => {
        return new Map(partners.map(p => [p.id, p]));
    }, [partners]);

    const columns: Column<Caution>[] = [
        {
            key: 'contract_id',
            label: 'Contrat / Partenaire',
            render: (row) => {
                const contract = contractsMap.get(row.contract_id);
                const partner = contract
                    ? partnersMap.get(contract.partner_id)
                    : null;

                return (
                    <div className="flex flex-col">
                        <strong>{partner?.name ?? '—'}</strong>
                        <span className="text-xs opacity-70">
                            {contract?.contract_type} — {row.contract_id.slice(0, 8)}
                        </span>
                    </div>
                );
            },
        },
        { key: 'amount_initial', label: 'Montant initial' },
        { key: 'amount_remaining', label: 'Montant restant' },
        { key: 'updated_at', label: 'Dernière mise à jour' },
        {
            key: 'sync_status',
            label: 'Sync',
            render: row => (
                <span className={`badge badge-${row.sync_status}`}>
                    {row.sync_status}
                </span>
            ),
        },
    ];

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="actions-bar">
                <div className="actions-left">
                    <h2>Cautions</h2>
                </div>
                <div className="actions-right">
                    <Button
                        label="Créer une caution"
                        icon={<FaPlus />}
                        variant="primary"
                        onClick={() => setModalOpen(true)}
                    />
                </div>
            </div>

            <div className="table-section">
                <Table columns={columns} data={cautions} />
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Créer une caution"
            >
                <FormCaution
                    onSubmit={async (data) => {
                        const created = await cautionsService.create(data);
                        setCautions(prev => [...prev, created]);
                        setModalOpen(false);
                    }}
                    onCancel={() => setModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default Cautions;
