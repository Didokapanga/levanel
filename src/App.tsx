import { BrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { AppRouter } from './router/AppRouter';
import { AppHeader } from './components/AppHeader ';

function App() {
  return (
    <BrowserRouter>
      <Layout
        sidebar={<Sidebar />}
        header={<AppHeader />}
        content={<AppRouter />}
      />
    </BrowserRouter>
  );
}

export default App;
