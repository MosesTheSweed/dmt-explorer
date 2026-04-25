import { useState } from 'react';
import AppShell from './components/layout/AppShell';
import SyncStatus from './pages/SyncStatus';
import Portfolio from "./pages/Portfolio.jsx";

const PAGES = {
    sync: <SyncStatus />,
    portfolio: <Portfolio />,
};

function App() {
    const [activePage, setActivePage] = useState('sync');

    return (
        <AppShell activePage={activePage} onNavigate={setActivePage}>
            {PAGES[activePage] || (
                <div style={{ color: '#9b8ab4', paddingTop: 8 }}>
                    Page coming soon: {activePage}
                </div>
            )}
        </AppShell>
    );
}

export default App;