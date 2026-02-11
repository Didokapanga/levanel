import '../styles/DashboardList.css';

export interface DashboardListItem {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    value?: string;
    badge?: { text: string; color: string }; // nouveau champ
}

// interface DashboardListProps {
//     items: DashboardListItem[];
//     title?: string;
// }


export const DashboardList: React.FC<{ items: DashboardListItem[]; title?: string }> = ({ items, title }) => {
    return (
        <div className="dashboard-list">
            {title && <h3 className="dashboard-list-title">{title}</h3>}
            <ul>
                {items.map((item, idx) => (
                    <li key={idx} className="dashboard-list-item">
                        {item.icon && <span className="dashboard-list-icon">{item.icon}</span>}
                        <div className="dashboard-list-content">
                            <span className="dashboard-list-title">{item.title}</span>
                            {item.subtitle && <span className="dashboard-list-subtitle">{item.subtitle}</span>}
                        </div>
                        {(item.value || item.badge) && (
                            <span
                                className="dashboard-list-badge"
                                style={{ backgroundColor: item.badge?.color || '#e5e7eb' }}
                            >
                                {item.badge?.text || item.value}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};
