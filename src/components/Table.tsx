import React, { type ReactNode } from 'react';
import '../styles/Table.css';

export interface Column<T> {
    key: string;
    label: string;
    render?: (row: T) => ReactNode;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    className?: string;
}

export function Table<T>({ columns, data, className }: TableProps<T>) {
    return (
        <div className={`table-container ${className || ''}`}>
            <table className="custom-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key}>{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="no-data">
                                Aucun résultat
                            </td>
                        </tr>
                    ) : (
                        data.map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'even' : 'odd'}>
                                {columns.map((col) => (
                                    <td key={col.key}>
                                        {col.render ? col.render(row) : (row as any)[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
