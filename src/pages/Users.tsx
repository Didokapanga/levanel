// src/pages/UsersPage.tsx
import React from 'react';
import { Table, type Column } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { FaPlus } from 'react-icons/fa';
import { FormUser } from '../components/FormUser';
import { usersService } from '../services/usersService';
import '../styles/Systems.css';
import type { User } from '../types/users';
import type { Role } from '../types/roles';
import { rolesService } from '../services/rolesService';

const Users: React.FC = () => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [users, setUsers] = React.useState<User[]>([]);
    const [roles, setRoles] = React.useState<Role[]>([]);

    // Charger la liste des utilisateurs au montage
    React.useEffect(() => {
        const fetchUsers = async () => {
            const list = await usersService.list();
            setUsers(list);
            rolesService.list().then(setRoles);

        };
        fetchUsers();
    }, []);

    const RolesMap = React.useMemo(() => {
        return Object.fromEntries(
            roles.map(r => [r.id, r.name])
        );
    }, [roles]);

    const columns: Column<User>[] = [
        { key: 'id', label: 'ID' },
        { key: 'username', label: 'Nom d’utilisateur' },
        {
            key: 'role_id', label: 'Rôle',
            render: (row) => RolesMap[row.role_id] ?? '—'
        },
        { key: 'is_deleted', label: 'Supprimé', render: (row) => (row.is_deleted ? 'Oui' : 'Non') },
        { key: 'updated_at', label: 'Dernière mise à jour' },
        {
            key: 'sync_status',
            label: 'Statut sync',
            render: (row) => <span className={`badge badge-${row.sync_status}`}>{row.sync_status}</span>,
        },
    ];

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Section haute : boutons */}
            <div className="actions-bar">
                <div className="actions-left">
                    <h2>Utilisateurs</h2>
                </div>
                <div className="actions-right">
                    <Button
                        label="Créer un utilisateur"
                        icon={<FaPlus />}
                        variant="primary"
                        onClick={() => setModalOpen(true)}
                    />
                </div>
            </div>

            {/* Section basse : tableau */}
            <div className="table-section">
                <Table columns={columns} data={users} />
            </div>

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Créer un nouvel utilisateur"
            >
                <FormUser
                    onSubmit={async (data) => {
                        try {
                            // Création avec mot de passe
                            const user = await usersService.create({
                                username: data.username,
                                role_id: data.role_id,
                                plainPassword: data.password, // ✅ champs attendu par usersService
                            });

                            setUsers((prev) => [...prev, user]);
                            setModalOpen(false);
                        } catch (err) {
                            console.error('Erreur lors de la création de l’utilisateur :', err);
                        }
                    }}
                    onCancel={() => setModalOpen(false)}
                    initialData={{ username: '', role_id: '', password: '' }} // ✅
                />
            </Modal>
        </div>
    );
};

export default Users;
