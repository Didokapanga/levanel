// src/pages/AuditLog.tsx
import React, { useEffect, useState } from 'react';
import { Table, type Column } from '../components/Table';
import { auditLogsService } from '../services/auditLogsService';
import type { AuditLog } from '../types/auditLog';
import '../styles/Systems.css'; // ⬅️ même CSS de layout

const PAGE_SIZE = 10;

const AuditLogPage: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    useEffect(() => {
        const loadLogs = async () => {
            try {
                const data = await auditLogsService.listBusinessLogs(page, PAGE_SIZE);
                const count = await auditLogsService.countBusinessLogs();

                setLogs(data);
                setTotal(count);
            } catch (err) {
                console.error('Erreur chargement audit logs :', err);
            }
        };

        loadLogs();
    }, [page]);

    // -------------------------
    // Colonnes du tableau
    // -------------------------
    const columns: Column<AuditLog>[] = [
        {
            key: 'timestamp',
            label: 'Date',
            render: (log) =>
                new Date(log.timestamp).toLocaleString(),
        },
        {
            key: 'action',
            label: 'Action',
            render: (log) => {
                switch (log.action) {
                    case 'validate':
                        return 'Validation';
                    case 'cancel':
                        return 'Annulation';
                    default:
                        return log.action;
                }
            },
        },
        {
            key: 'entity_id',
            label: 'Réservation',
            render: (log) => log.entity_id.slice(0, 8),
        },
        {
            key: 'user_id',
            label: 'Utilisateur',
        },
        {
            key: 'details',
            label: 'Détails',
            render: (log) =>
                log.details ? (
                    <pre className="whitespace-pre-wrap text-xs">
                        {JSON.stringify(JSON.parse(log.details), null, 2)}
                    </pre>
                ) : (
                    '-'
                ),
        },
    ];

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Section haute */}
            <div className="actions-bar">
                <div className="actions-left">
                    <h2>Audit des actions</h2>
                </div>
            </div>

            {/* Section tableau */}
            <div className="table-section">
                <Table columns={columns} data={logs} />
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center">
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

export default AuditLogPage;
