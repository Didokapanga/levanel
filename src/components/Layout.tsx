import React, { type ReactNode, useState } from 'react';
import '../styles/Layout.css';

interface LayoutProps {
    sidebar: ReactNode;
    content: ReactNode;
    header?: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ sidebar, content }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="layout">
            {/* Sidebar desktop + overlay mobile */}
            <aside className={`layout-sidebar ${sidebarOpen ? 'open' : ''}`}>
                {sidebar}
            </aside>

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Zone droite */}
            <div className="layout-main">
                <header className="layout-header">
                    <div className="flex items-center justify-between w-full">
                        {/* Hamburger mobile */}
                        <button
                            className="hamburger md:hidden p-2"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Toggle sidebar"
                        >
                            <div></div>
                            <div></div>
                            <div></div>
                        </button>

                        {/* Titre */}
                        <h1 className="text-lg font-semibold text-gray-800">

                        </h1>

                        {/* Espace pour actions futur */}
                        <div></div>
                    </div>
                </header>

                <main className="layout-content">{content}</main>
            </div>
        </div>
    );
};
