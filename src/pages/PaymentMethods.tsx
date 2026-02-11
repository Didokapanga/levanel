// src/pages/PaymentMethodsPage.tsx
import React from 'react';
import { Table, type Column } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { FaPlus } from 'react-icons/fa';
import '../styles/Systems.css';
import { FormPaymentMethod } from '../components/FormPaymentMethod';
import { paymentMethodsService } from '../services/paymentMethodsService';
import type { PaymentMethod } from '../types/paymentMethod';

const PaymentMethods: React.FC = () => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>([]);

    // Charger la liste des méthodes de paiement
    React.useEffect(() => {
        const fetchPaymentMethods = async () => {
            const list = await paymentMethodsService.list();
            setPaymentMethods(list);
        };
        fetchPaymentMethods();
    }, []);

    const columns: Column<PaymentMethod>[] = [
        { key: 'id', label: 'ID' },
        { key: 'label', label: 'Libellé' },
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
                    <h2>Méthodes de paiement</h2>
                </div>
                <div className="actions-right">
                    <Button
                        label="Créer une méthode"
                        icon={<FaPlus />}
                        variant="primary"
                        onClick={() => setModalOpen(true)}
                    />
                </div>
            </div>

            {/* Section basse : tableau */}
            <div className="table-section">
                <Table columns={columns} data={paymentMethods} />
            </div>

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Créer une nouvelle méthode de paiement"
            >
                <FormPaymentMethod
                    onSubmit={async (data) => {
                        try {
                            // Créer la méthode via le service
                            const method = await paymentMethodsService.create(data.label);

                            if (method) {
                                // Ajouter à la liste locale seulement si la création a réussi
                                setPaymentMethods((prev) => [...prev, method]);
                            } else {
                                console.warn('La méthode existe déjà, création annulée');
                            }

                            setModalOpen(false);
                        } catch (err) {
                            console.error('Erreur lors de la création de la méthode :', err);
                        }
                    }}
                    onCancel={() => setModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default PaymentMethods;
