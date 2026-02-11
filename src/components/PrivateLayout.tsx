// src/components/PrivateLayout.tsx
import { Layout } from './Layout';
import { Sidebar } from './Sidebar';
import { AppRouter } from '../router/AppRouter';
import { AppHeader } from './AppHeader ';

export const PrivateLayout = () => {
    return (
        <Layout
            sidebar={<Sidebar />}
            header={<AppHeader />}
            content={<AppRouter />}
        />
    );
};
