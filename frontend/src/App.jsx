import React, { useContext, useState } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Layout    from './components/Layout';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import Borrow    from './pages/Borrow';
import Returns   from './pages/Returns';
import Students  from './pages/Students';
import Schools   from './pages/Schools';
import Books     from './pages/Books';
import Reports   from './pages/Reports';

function MainAppContent() {
    const { token } = useContext(AuthContext);
    const [page, setPage] = useState('dashboard');

    if (!token) return <Login />;

    return (
        <Layout setPage={setPage} currentPage={page}>
            {page === 'dashboard' && <Dashboard />}
            {page === 'borrow'    && <Borrow />}
            {page === 'return'    && <Returns />}
            {page === 'students'  && <Students />}
            {page === 'schools'   && <Schools />}
            {page === 'books'     && <Books />}
            {page === 'reports'   && <Reports />}
        </Layout>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <MainAppContent />
        </AuthProvider>
    );
}
