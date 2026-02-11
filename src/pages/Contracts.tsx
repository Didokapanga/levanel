import React from 'react';
import { Table, type Column } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { FormContract } from '../components/FormContract';
import { FaPlus } from 'react-icons/fa';
import '../styles/Systems.css';

import { contractsService } from '../services/contractsService';
import type { Contract } from '../types/contract';
import type { Partner } from '../types/partner';
import { partnersService } from '../services/partnersService';

const Contracts: React.FC = () => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [contracts, setContracts] = React.useState<Contract[]>([]);
    const [partners, setPartners] = React.useState<Partner[]>([]);

    React.useEffect(() => {
        contractsService.list().then(setContracts);
        partnersService.list().then(setPartners);
    }, []);

    const partnerMap = React.useMemo(() => {
        return Object.fromEntries(
            partners.map(p => [p.id, p.name])
        );
    }, [partners]);

    const columns: Column<Contract>[] = [
        {
            key: 'partner_id', label: 'Partenaire',
            render: (row) => partnerMap[row.partner_id] ?? '—'
        },
        { key: 'contract_type', label: 'Type' },
        { key: 'status', label: 'Statut' },
        { key: 'start_date', label: 'Début' },
        { key: 'end_date', label: 'Fin' },
        {
            key: 'sync_status',
            label: 'Sync',
            render: (row) => (
                <span className={`badge badge-${row.sync_status}`}>
                    {row.sync_status}
                </span>
            ),
        },
    ];

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="actions-bar">
                <h2>Contrats</h2>
                <Button
                    label="Créer un contrat"
                    icon={<FaPlus />}
                    variant="primary"
                    onClick={() => setModalOpen(true)}
                />
            </div>

            <div className="table-section">
                <Table columns={columns} data={contracts} />
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Nouveau contrat"
            >
                <FormContract
                    onSubmit={async (data) => {
                        const contract = await contractsService.create({
                            ...data,
                            contract_status: 'active',
                        });

                        setContracts((prev) => [...prev, contract]);
                        setModalOpen(false);
                    }}
                    onCancel={() => setModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default Contracts;
