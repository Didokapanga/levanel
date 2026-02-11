import React from 'react';
import { Table, type Column } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { FormStock } from '../components/FormStock';
import { FaPlus } from 'react-icons/fa';
import '../styles/Systems.css';

import { stocksService } from '../services/stocksService';
import { contractsService } from '../services/contractsService';
import { partnersService } from '../services/partnersService';

import type { Stock } from '../types/stock';
import type { Contract } from '../types/contract';
import type { Partner } from '../types/partner';

const Stocks: React.FC = () => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [stocks, setStocks] = React.useState<Stock[]>([]);
    const [contracts, setContracts] = React.useState<Contract[]>([]);
    const [partners, setPartners] = React.useState<Partner[]>([]);

    React.useEffect(() => {
        const loadData = async () => {
            const [stocksList, contractsList, partnersList] =
                await Promise.all([
                    stocksService.list(),
                    contractsService.list(),
                    partnersService.list(),
                ]);

            setStocks(stocksList);
            setContracts(contractsList);
            setPartners(partnersList);
        };

        loadData();
    }, []);

    const contractsMap = React.useMemo(
        () => new Map(contracts.map(c => [c.id, c])),
        [contracts]
    );

    const partnersMap = React.useMemo(
        () => new Map(partners.map(p => [p.id, p])),
        [partners]
    );

    const columns: Column<Stock>[] = [
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
        { key: 'amount_initial', label: 'Stock initial' },
        { key: 'amount_remaining', label: 'Stock restant' },
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
                    <h2>Stocks</h2>
                </div>
                <div className="actions-right">
                    <Button
                        label="Créer un stock"
                        icon={<FaPlus />}
                        variant="primary"
                        onClick={() => setModalOpen(true)}
                    />
                </div>
            </div>

            <div className="table-section">
                <Table columns={columns} data={stocks} />
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Créer un stock"
            >
                <FormStock
                    onSubmit={async ({ contract_id, amount }) => {
                        const created = await stocksService.create({
                            contract_id,
                            amount,
                        });

                        setStocks(prev => [...prev, created]);
                        setModalOpen(false);
                    }}
                    onCancel={() => setModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default Stocks;
