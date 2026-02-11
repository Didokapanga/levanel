// src/pages/Systems.tsx
import React from 'react';
import { Table, type Column } from '../components/Table';
import '../styles/Systems.css';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { FaPlus } from 'react-icons/fa';
import { FormSystem } from '../components/FormSystem';
import { systemsService } from '../services/systemsService';
import type { System as SystemType } from '../types/system'; // ✅ type central

const Systems: React.FC = () => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [systems, setSystems] = React.useState<SystemType[]>([]);

    // Charger la liste des systèmes au montage
    React.useEffect(() => {
        const fetchSystems = async () => {
            try {
                const list = await systemsService.list();
                setSystems(list);
            } catch (err) {
                console.error('Erreur lors du chargement des systèmes :', err);
            }
        };
        fetchSystems();
    }, []);

    const columns: Column<SystemType>[] = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nom' },
        { key: 'updated_at', label: 'Dernière mise à jour' },
        {
            key: 'sync_status',
            label: 'Statut sync',
            render: (row) => {
                let badgeClass = '';
                let label = '';
                switch (row.sync_status) {
                    case 'clean':
                        badgeClass = 'badge-clean';
                        label = 'Clean';
                        break;
                    case 'dirty':
                        badgeClass = 'badge-dirty';
                        label = 'Dirty';
                        break;
                    case 'conflict':
                        badgeClass = 'badge-conflict';
                        label = 'Conflict';
                        break;
                }
                return <span className={`badge ${badgeClass}`}>{label}</span>;
            }
        },
    ];

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Section haute : boutons */}
            <div className="actions-bar">
                <div className="actions-left">
                    <h2>Systèmes</h2>
                </div>
                <div className="actions-right">
                    <Button
                        label="Créer un système"
                        icon={<FaPlus />}
                        variant="primary"
                        onClick={() => setModalOpen(true)}
                    />
                </div>
            </div>

            {/* Section basse : tableau */}
            <div className="table-section">
                <Table columns={columns} data={systems} />
            </div>

            {/* Modal de création */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Créer un nouveau système"
            >
                <FormSystem
                    onSubmit={async (data) => {
                        try {
                            // Créer le système dans Dexie
                            const system = await systemsService.create(data.name);

                            // Mettre à jour la liste locale
                            setSystems((prev) => [...prev, system]);

                            // Fermer le modal
                            setModalOpen(false);
                        } catch (err) {
                            console.error('Erreur lors de la création du système :', err);
                        }
                    }}
                    onCancel={() => setModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default Systems;
