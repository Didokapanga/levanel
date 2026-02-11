// src/components/ProtectedRoute.tsx
import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { authServiceDexie } from '../services/authServiceDexie';

interface ProtectedRouteProps {
    children: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const user = authServiceDexie.getCurrentUser();

    if (!user) {
        // Si pas connecté → redirige vers /login
        return <Navigate to="/login" replace />;
    }

    // Sinon → affiche l’enfant (layout / page)
    return children;
};
