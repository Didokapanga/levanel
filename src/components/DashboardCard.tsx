import React, { type ReactNode } from 'react';
import '../styles/DashboardCard.css';

interface DashboardCardProps {
    title: string;
    subtitle?: string;
    icon: ReactNode;
    iconBg?: string; // couleur du cercle icône
    value: string | number;
    footerText?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    subtitle,
    icon,
    iconBg = '#2563eb',
    value,
    footerText,
}) => {
    return (
        <div className="dashboard-card">
            {/* Haut */}
            <div className="card-header">
                <div className="card-header-left">
                    <h4>{title}</h4>
                    {subtitle && <span className="subtitle">{subtitle}</span>}
                </div>

                <div
                    className="card-icon"
                    style={{ backgroundColor: iconBg }}
                >
                    {icon}
                </div>
            </div>

            {/* Bas */}
            <div className="card-body">
                <div className="card-value">{value}</div>
                {footerText && (
                    <div className="card-footer-text">
                        {footerText}
                    </div>
                )}
            </div>
        </div>
    );
};
