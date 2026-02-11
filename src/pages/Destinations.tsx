// src/pages/Destinations.tsx
import React from 'react';
import { Table, type Column } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { FaPlus } from 'react-icons/fa';
import '../styles/FormEntity.css';
import { FormDestination } from '../components/FormDestination';
import { destinationsService } from '../services/destinationsService';
import type { Destination } from '../types/destination';

const Destinations: React.FC = () => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [destinations, setDestinations] = React.useState<Destination[]>([]);

    // Charger les destinations au montage
    React.useEffect(() => {
        const fetchDestinations = async () => {
            const list = await destinationsService.list();
            setDestinations(list);
        };
        fetchDestinations();
    }, []);

    const columns: Column<Destination>[] = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Nom' },
        { key: 'city', label: 'Ville' },
        { key: 'country', label: 'Pays' },
        { key: 'updated_at', label: 'Dernière mise à jour' },
        {
            key: 'sync_status',
            label: 'Statut sync',
            render: (row) => {
                const className = `badge badge-${row.sync_status}`;
                return <span className={className}>{row.sync_status}</span>;
            },
        },
    ];

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Section haute : boutons */}
            <div className="actions-bar">
                <div className="actions-left">
                    <h2>Destinations</h2>
                </div>
                <div className="actions-right">
                    <Button
                        label="Créer une destination"
                        icon={<FaPlus />}
                        variant="primary"
                        onClick={() => setModalOpen(true)}
                    />
                </div>
            </div>

            {/* Section basse : tableau */}
            <div className="table-section">
                <Table columns={columns} data={destinations} />
            </div>

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Créer une nouvelle destination"
            >
                <FormDestination
                    onSubmit={async (data) => {
                        try {
                            const destination = await destinationsService.create({
                                name: data.name,
                                city: data.city,
                                country: data.country,
                                code: data.code,
                            });

                            if (!destination) {
                                alert('Ce code de destination existe déjà !');
                                return;
                            }

                            setDestinations((prev) => [...prev, destination]);
                            setModalOpen(false);
                        } catch (err) {
                            console.error('Erreur lors de la création de la destination :', err);
                        }
                    }}
                    onCancel={() => setModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default Destinations;
