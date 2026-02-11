// src/pages/CashRegisters.tsx
import React, { useEffect, useState } from 'react';
import { Table, type Column } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { FaPlus } from 'react-icons/fa';
import '../styles/Systems.css';

import { cashRegistersService } from '../services/cashRegistersService';
import type { CashRegister } from '../types/cashRegister';
import { FormCashRegister } from '../components/FormCashRegister';

const CashRegisters: React.FC = () => {
    const [entries, setEntries] = useState<CashRegister[]>([]);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        cashRegistersService.list().then(setEntries);
    }, []);

    const columns: Column<CashRegister>[] = [
        { key: 'operation_date', label: 'Date' },
        { key: 'direction', label: 'Sens' },
        { key: 'source', label: 'Origine' },
        { key: 'amount', label: 'Montant' },
        { key: 'currency', label: 'Devise' },
        { key: 'description', label: 'Description' },
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
                    <h2>Caisse</h2>
                </div>
                <div className="actions-right">
                    <Button
                        label="Nouvelle opération"
                        icon={<FaPlus />}
                        variant="primary"
                        onClick={() => setModalOpen(true)}
                    />
                </div>
            </div>

            <div className="table-section">
                <Table columns={columns} data={entries} />
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Nouvelle opération de caisse"
            >
                <FormCashRegister
                    onSubmit={async data => {
                        const created = await cashRegistersService.create(data);
                        setEntries(prev => [...prev, created]);
                        setModalOpen(false);
                    }}
                    onCancel={() => setModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default CashRegisters;
