import React from 'react';
import { Table, type Column } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { FormDepartment } from '../components/FormDepartment';
import { FaPlus } from 'react-icons/fa';
import '../styles/Systems.css';

import { departmentsService } from '../services/departmentsService';
import type { Department } from '../types/department';

const Departments: React.FC = () => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [departments, setDepartments] = React.useState<Department[]>([]);

    /* =========================
       Chargement des départements
       ========================= */
    React.useEffect(() => {
        const fetchDepartments = async () => {
            const list = await departmentsService.list();
            setDepartments(list);
        };
        fetchDepartments();
    }, []);

    const columns: Column<Department>[] = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nom du département' },
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
                    <h2>Départements</h2>
                </div>
                <div className="actions-right">
                    <Button
                        label="Créer un département"
                        icon={<FaPlus />}
                        variant="primary"
                        onClick={() => setModalOpen(true)}
                    />
                </div>
            </div>

            {/* Tableau */}
            <div className="table-section">
                <Table columns={columns} data={departments} />
            </div>

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Créer un nouveau département"
            >
                <FormDepartment
                    onSubmit={async (data) => {
                        try {
                            const dept = await departmentsService.create(data.name);
                            setDepartments(prev => [...prev, dept]);
                            setModalOpen(false);
                        } catch (err) {
                            console.error('Erreur création département', err);
                        }
                    }}
                    onCancel={() => setModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default Departments;
