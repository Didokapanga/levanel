import React, { useEffect, useState } from 'react';
import { Table, type Column } from '../components/Table';
import { syncStateService } from '../services/syncStateService';
import type { SyncState } from '../types/syncState';

const PAGE_SIZE = 10;

const SyncStatePage: React.FC = () => {
    const [syncStates, setSyncStates] = useState<SyncState[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

    useEffect(() => {
        const loadSyncStates = async () => {
            try {
                // ⚡ Appel sans arguments
                const data = await syncStateService.list();
                setSyncStates(data);
                setTotal(data.length); // ⚡ on compte localement
            } catch (err) {
                console.error('Erreur chargement sync states :', err);
            }
        };

        loadSyncStates();
    }, []);

    // -------------------------
    // Colonnes
    // -------------------------
    const columns: Column<SyncState>[] = [
        {
            key: 'table_name',
            label: 'Table',
        },
        {
            key: 'last_synced_at',
            label: 'Dernière synchronisation',
            render: (row) =>
                row.last_synced_at
                    ? new Date(row.last_synced_at).toLocaleString()
                    : '-',
        },
        {
            key: 'sync_status',
            label: 'Statut',
            render: (row) => row.sync_status || '-',
        },
    ];

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Header */}
            <div className="actions-bar">
                <div className="actions-left">
                    <h2>État de synchronisation</h2>
                </div>
            </div>

            {/* Table */}
            <div className="table-section">
                <Table columns={columns} data={syncStates} />
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Précédent
                </button>

                <span>
                    Page {page} / {totalPages}
                </span>

                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
};

export default SyncStatePage;
