import React, { useState } from 'react';
import logo from '../assets/logo.png';
import '../styles/Sidebar.css';
import { NavLink } from 'react-router-dom';

const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'menu-item active' : 'menu-item';

type SectionKey =
    | 'general'
    | 'finance'
    | 'partners'
    | 'reference'
    | 'organization'
    | 'audit';

export const Sidebar: React.FC = () => {
    const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
        general: true,
        finance: false,
        partners: false,
        reference: false,
        organization: false,
        audit: false,
    });

    const toggleSection = (key: SectionKey) => {
        setOpenSections(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div className="sidebar">
            {/* Header */}
            <div className="sidebar-header">
                <img src={logo} alt="Travel ERP" className="sidebar-logo" />
            </div>

            {/* Menu */}
            <nav className="sidebar-menu">

                {/* GENERAL */}
                <div className="menu-section">
                    <p className="menu-title" onClick={() => toggleSection('general')}>
                        Général
                    </p>
                    {openSections.general && (
                        <ul>
                            <NavLink to="/" end className={navClass}>
                                Dashboard
                            </NavLink>

                            <NavLink to="/reservations" className={navClass}>
                                Réservations
                            </NavLink>

                            <NavLink to="/reservation-segments" className={navClass}>
                                Segments
                            </NavLink>

                            <NavLink to="/reservation-status" className={navClass}>
                                Statuts
                            </NavLink>
                        </ul>
                    )}
                </div>

                {/* FINANCE */}
                <div className="menu-section">
                    <p className="menu-title" onClick={() => toggleSection('finance')}>
                        Finance
                    </p>
                    {openSections.finance && (
                        <ul>
                            <NavLink to="/cautions" className={navClass}>
                                Cautions
                            </NavLink>

                            <NavLink to="/stocks" className={navClass}>
                                Stocks
                            </NavLink>

                            <NavLink to="/cash_registers" className={navClass}>
                                Enregistrement de cash
                            </NavLink>

                            <NavLink to="/financial-operations" className={navClass}>
                                Opérations financières
                            </NavLink>
                        </ul>
                    )}
                </div>

                {/* PARTENAIRES */}
                <div className="menu-section">
                    <p className="menu-title" onClick={() => toggleSection('partners')}>
                        Partenaires & Contrats
                    </p>
                    {openSections.partners && (
                        <ul>
                            <NavLink to="/partners" className={navClass}>
                                Partenaires
                            </NavLink>

                            <NavLink to="/contracts" className={navClass}>
                                Contrats
                            </NavLink>
                        </ul>
                    )}
                </div>

                {/* RÉFÉRENTIELS */}
                <div className="menu-section">
                    <p className="menu-title" onClick={() => toggleSection('reference')}>
                        Référentiels
                    </p>
                    {openSections.reference && (
                        <ul>
                            <NavLink to="/systems" className={navClass}>
                                Systèmes
                            </NavLink>

                            <NavLink to="/airlines" className={navClass}>
                                Compagnies
                            </NavLink>

                            <NavLink to="/destinations" className={navClass}>
                                Destinations
                            </NavLink>

                            <NavLink to="/payment-methods" className={navClass}>
                                Méthodes de paiement
                            </NavLink>
                        </ul>
                    )}
                </div>

                {/* ORGANISATION */}
                <div className="menu-section">
                    <p className="menu-title" onClick={() => toggleSection('organization')}>
                        Organisation
                    </p>
                    {openSections.organization && (
                        <ul>
                            <NavLink to="/users" className={navClass}>
                                Utilisateurs
                            </NavLink>

                            <NavLink to="/roles" className={navClass}>
                                Rôles
                            </NavLink>

                            <NavLink to="/departments" className={navClass}>
                                Départements
                            </NavLink>
                        </ul>
                    )}
                </div>

                {/* AUDIT */}
                <div className="menu-section">
                    <p className="menu-title" onClick={() => toggleSection('audit')}>
                        Audit & Sync
                    </p>
                    {openSections.audit && (
                        <ul>
                            <NavLink to="/audit-logs" className={navClass}>
                                Audit logs
                            </NavLink>

                            <NavLink to="/change-logs" className={navClass}>
                                Change logs
                            </NavLink>

                            <NavLink to="/sync" className={navClass}>
                                Synchronisation
                            </NavLink>
                        </ul>
                    )}

                </div>

            </nav>
        </div>
    );
};
