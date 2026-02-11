import React from 'react';
import { Table, type Column } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { FormPartner } from '../components/FormPartner';
import { FaPlus } from 'react-icons/fa';
import '../styles/Systems.css';

import { partnersService } from '../services/partnersService';
import type { Partner, PartnerType } from '../types/partner';

const Partners: React.FC = () => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [partners, setPartners] = React.useState<Partner[]>([]);

    // Chargement des partenaires
    React.useEffect(() => {
        const fetchPartners = async () => {
            const list = await partnersService.list();
            setPartners(list);
        };
        fetchPartners();
    }, []);

    const columns: Column<Partner>[] = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nom' },
        { key: 'type', label: 'Type' },
        { key: 'updated_at', label: 'Dernière mise à jour' },
        {
            key: 'sync_status',
            label: 'Statut sync',
            render: row => (
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
                    <h2>Partenaires</h2>
                </div>
                <div className="actions-right">
                    <Button
                        label="Créer un partenaire"
                        icon={<FaPlus />}
                        variant="primary"
                        onClick={() => setModalOpen(true)}
                    />
                </div>
            </div>

            {/* Tableau */}
            <div className="table-section">
                <Table columns={columns} data={partners} />
            </div>

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Créer un nouveau partenaire"
            >
                <FormPartner
                    onSubmit={async (data: { name: string; type: PartnerType }) => {
                        try {
                            const partner = await partnersService.create(data);
                            if (partner) setPartners(prev => [...prev, partner]);
                            else console.warn('Ce partenaire existe déjà');
                            setModalOpen(false);
                        } catch (err) {
                            console.error('Erreur création partenaire', err);
                        }
                    }}
                    onCancel={() => setModalOpen(false)}
                    initialData={{ name: '', type: 'agency' }}
                />
            </Modal>
        </div>
    );
};

export default Partners;
