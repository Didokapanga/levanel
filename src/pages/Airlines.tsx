// src/pages/Airlines.tsx
import React from 'react';
import { Table, type Column } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { FaPlus } from 'react-icons/fa';
import '../styles/FormEntity.css';
import { FormAirline } from '../components/FormAirline';
import { airlinesService } from '../services/airlinesService';
import type { Airline } from '../types/airline';

const Airlines: React.FC = () => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [airlines, setAirlines] = React.useState<Airline[]>([]);

    // Charger les données depuis Dexie
    React.useEffect(() => {
        const fetchAirlines = async () => {
            const list = await airlinesService.list();
            setAirlines(list);
        };
        fetchAirlines();
    }, []);

    const columns: Column<Airline>[] = [
        { key: 'code', label: 'Code' },
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
            <div className="actions-bar">
                <div className="actions-left">
                    <h2>Compagnies aériennes</h2>
                </div>
                <div className="actions-right">
                    <Button
                        label="Créer une compagnie"
                        icon={<FaPlus />}
                        variant="primary"
                        onClick={() => setModalOpen(true)}
                    />
                </div>
            </div>

            <div className="table-section">
                <Table columns={columns} data={airlines} />
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Créer une nouvelle compagnie"
            >
                <FormAirline
                    onSubmit={async (data) => {
                        try {
                            const airline = await airlinesService.create(data.code, data.name);
                            if (!airline) {
                                alert('Le code existe déjà.');
                                return;
                            }

                            // Mettre à jour le tableau
                            setAirlines((prev) => [...prev, airline]);
                            setModalOpen(false);
                        } catch (err) {
                            console.error('Erreur lors de la création :', err);
                        }
                    }}
                    onCancel={() => setModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default Airlines;
