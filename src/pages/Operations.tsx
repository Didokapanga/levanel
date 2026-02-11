// src/pages/FinancialOperations.tsx
import React, { useEffect, useState } from 'react';
import { Table, type Column } from '../components/Table';
import '../styles/Systems.css';

import { financialOperationsService } from '../services/financialOperationsService';
import type { FinancialOperation } from '../types/financialOperation';

const FinancialOperations: React.FC = () => {
    const [operations, setOperations] = useState<FinancialOperation[]>([]);

    useEffect(() => {
        financialOperationsService.list().then(setOperations);
    }, []);

    const columns: Column<FinancialOperation>[] = [
        { key: 'created_at', label: 'Date' },
        { key: 'reservation_id', label: 'Réservation' },
        { key: 'contract_id', label: 'Contrat' },
        {
            key: 'source',
            label: 'Source',
            render: row => (
                <span className={`badge badge-source-${row.source}`}>
                    {row.source}
                </span>
            ),
        },
        {
            key: 'type',
            label: 'Type',
            render: row => (
                <span className={`badge badge-type-${row.type}`}>
                    {row.type}
                </span>
            ),
        },
        { key: 'amount', label: 'Montant' },
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
                    <h2>Journal des opérations financières</h2>
                </div>
            </div>

            <div className="table-section">
                <Table columns={columns} data={operations} />
            </div>
        </div>
    );
};

export default FinancialOperations;
