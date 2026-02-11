// src/pages/RolesPage.tsx
import React from 'react';
import { Table, type Column } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { FormRole } from '../components/FormRole';
import { FaPlus } from 'react-icons/fa';
import '../styles/Systems.css';

import { rolesService } from '../services/rolesService';
import type { Role } from '../types/roles';

const Roles: React.FC = () => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [roles, setRoles] = React.useState<Role[]>([]);

    /* =========================
       Chargement des rôles
       ========================= */
    React.useEffect(() => {
        const fetchRoles = async () => {
            const list = await rolesService.list();
            setRoles(list);
        };
        fetchRoles();
    }, []);

    const columns: Column<Role>[] = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nom du rôle' },
        { key: 'updated_at', label: 'Dernière mise à jour' },
        {
            key: 'sync_status',
            label: 'Statut sync',
            render: (row) => (
                <span className={`badge badge-${row.sync_status}`}>
                    {row.sync_status}
                </span>
            ),
        },
    ];

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Header */}
            <div className="actions-bar">
                <div className="actions-left">
                    <h2>Rôles</h2>
                </div>
                <div className="actions-right">
                    <Button
                        label="Créer un rôle"
                        icon={<FaPlus />}
                        variant="primary"
                        onClick={() => setModalOpen(true)}
                    />
                </div>
            </div>

            {/* Tableau */}
            <div className="table-section">
                <Table columns={columns} data={roles} />
            </div>

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Créer un nouveau rôle"
            >
                <FormRole
                    onSubmit={async (data) => {
                        try {
                            const role = await rolesService.create(data.name);
                            setRoles((prev) => [...prev, role]);
                            setModalOpen(false);
                        } catch (err) {
                            console.error('Erreur création rôle', err);
                        }
                    }}
                    onCancel={() => setModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default Roles;
