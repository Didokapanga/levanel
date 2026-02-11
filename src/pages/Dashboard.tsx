import React, { useEffect, useState } from 'react';
import { DashboardCard } from '../components/DashboardCard';
import { DashboardList, type DashboardListItem } from '../components/DashboardList';
import '../styles/Dashboard.css';
import { FaMoneyBillWave, FaTicketAlt, FaTimesCircle, FaPlane, FaBoxes, FaCoins } from 'react-icons/fa';
import { db } from '../db/database';

const Dashboard: React.FC = () => {
    const [recentReservations, setRecentReservations] = useState<DashboardListItem[]>([]);
    const [stockTracking, setStockTracking] = useState<DashboardListItem[]>([]);
    const [cautionHistory, setCautionHistory] = useState<DashboardListItem[]>([]);
    const [cancelledAmount, setCancelledAmount] = useState<string>('0');
    const [ca, setCa] = useState<string>('0');

    useEffect(() => {
        const loadDashboardData = async () => {
            // Chiffre d'affaires aujourd'hui
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const nextDay = new Date(today);
            nextDay.setDate(nextDay.getDate() + 1);

            const ops = await db.financial_operations
                .where('created_at')
                .between(today.toISOString(), nextDay.toISOString(), true, false)
                .toArray();
            const totalCA = ops.reduce((sum, op) => sum + Number(op.amount), 0);
            setCa(`$${totalCA.toLocaleString()}`);

            // Annulations du mois (somme)
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

            const cancelledReservations = await db.reservations
                .where('status')
                .equals('cancelled')
                .filter(r =>
                    new Date(r.updated_at) >= startOfMonth &&
                    new Date(r.updated_at) < endOfMonth
                )
                .toArray();

            const cancelledTotal = cancelledReservations.reduce(
                (sum, r) => sum + Number(r.total_amount),
                0
            );

            setCancelledAmount(`$${cancelledTotal.toLocaleString()}`);

            // Dernières réservations
            const reservations = await db.reservations
                .orderBy('updated_at')
                .reverse()
                .limit(5)
                .toArray();
            const recent: DashboardListItem[] = reservations.map(r => ({
                title: r.client_name ?? 'Inconnu',
                subtitle: `Montant: $${r.total_amount}`,
                icon: <FaPlane />,
                value: r.status
            }));
            setRecentReservations(recent);

            // Suivi stock (stocks actuels)
            const stocks = await db.stocks
                .orderBy('updated_at')
                .reverse()
                .limit(5)
                .toArray();
            const stockList: DashboardListItem[] = await Promise.all(
                stocks.map(async s => {
                    const contract = await db.contracts.get(s.contract_id);
                    const partner = contract ? await db.partners.get(contract.partner_id) : null;
                    return {
                        title: partner?.name ?? 'Inconnu',
                        subtitle: `Stock restant: ${s.amount_remaining}`,
                        icon: <FaBoxes />,
                        badge: {
                            text: `Initial: ${s.amount_initial}`,
                            color: '#2563eb'
                        }
                    };
                })
            );
            setStockTracking(stockList);

            // Historique caution (cautions actuelles)
            const cautions = await db.cautions
                .orderBy('updated_at')
                .reverse()
                .limit(5)
                .toArray();
            const cautionList: DashboardListItem[] = await Promise.all(
                cautions.map(async c => {
                    const contract = await db.contracts.get(c.contract_id);
                    const partner = contract ? await db.partners.get(contract.partner_id) : null;
                    return {
                        title: partner?.name ?? 'Inconnu',
                        subtitle: `Caution restante: ${c.amount_remaining}`,
                        icon: <FaCoins />,
                        badge: {
                            text: `Initial: ${c.amount_initial}`,
                            color: c.amount_remaining > 0 ? '#16a34a' : '#dc2626'
                        }
                    };
                })
            );
            setCautionHistory(cautionList);
        };

        loadDashboardData();
    }, []);

    return (
        <div className="dashboard-container">
            {/* Section gauche */}
            <div className="dashboard-left">
                <div className="dashboard-cards-row">
                    <DashboardCard
                        title="Chiffre d'affaires"
                        subtitle="Aujourd'hui"
                        icon={<FaMoneyBillWave />}
                        iconBg="#16a34a"
                        value={ca}
                        footerText="Total encaissé"
                    />
                    <DashboardCard
                        title="Réservations"
                        subtitle="En cours"
                        icon={<FaTicketAlt />}
                        iconBg="#2563eb"
                        value={`${recentReservations.length}`}
                        footerText="À valider"
                    />
                    <DashboardCard
                        title="Annulations"
                        subtitle="Ce mois"
                        icon={<FaTimesCircle />}
                        iconBg="#dc2626"
                        value={cancelledAmount}
                        footerText="Montant annulé"
                    />
                </div>

                <div className="dashboard-bottom-row">
                    <DashboardList items={recentReservations} title="Dernières réservations" />
                    <DashboardList items={stockTracking} title="Historique Stock" />
                </div>
            </div>

            {/* Section droite */}
            <div className="dashboard-right">
                <DashboardList items={cautionHistory} title="Historique Caution" />
            </div>
        </div>
    );
};

export default Dashboard;