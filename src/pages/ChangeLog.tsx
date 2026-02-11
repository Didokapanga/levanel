import React, { useEffect, useState } from 'react';
import { Table, type Column } from '../components/Table';
import { changeLogsService } from '../services/changeLogsService';
import type { ChangeLog } from '../types/changeLog';

const PAGE_SIZE = 10;

const ChangeLogPage: React.FC = () => {
    const [logs, setLogs] = useState<ChangeLog[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

    useEffect(() => {
        const loadLogs = async () => {
            try {
                const data = await changeLogsService.list(page, PAGE_SIZE);
                const count = await changeLogsService.count();

                setLogs(data);
                setTotal(count);
            } catch (err) {
                console.error('Erreur chargement change logs :', err);
            }
        };

        loadLogs();
    }, [page]);

    // -------------------------
    // Colonnes
    // -------------------------
    const columns: Column<ChangeLog>[] = [
        {
            key: 'updated_at',
            label: 'Date',
            render: (log) => new Date(log.updated_at).toLocaleString(),
        },
        {
            key: 'table_name',
            label: 'Table',
        },
        {
            key: 'record_id',
            label: 'Enregistrement',
            render: (log) => log.record_id.slice(0, 8),
        },
        {
            key: 'column_name',
            label: 'Champ',
        },
        {
            key: 'old_value',
            label: 'Avant',
            render: (log) =>
                log.old_value !== null
                    ? JSON.stringify(log.old_value)
                    : '-',
        },
        {
            key: 'new_value',
            label: 'Après',
            render: (log) =>
                log.new_value !== null
                    ? JSON.stringify(log.new_value)
                    : '-',
        },
        {
            key: 'user_id',
            label: 'Utilisateur',
            render: (log) => log.user_id || '-',
        },
    ];

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Header */}
            <div className="actions-bar">
                <div className="actions-left">
                    <h2>Historique des changements</h2>
                </div>
            </div>

            {/* Table */}
            <div className="table-section">
                <Table columns={columns} data={logs} />
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Précédent
                </button>

                <span>
                    Page {page} / {totalPages}
                </span>

                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
};

export default ChangeLogPage;
