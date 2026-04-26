import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import SyncStatus from './pages/SyncStatus';
import Portfolio from './pages/portfolio/index.jsx';
import TokenDetail from "./components/tokens/TokenDetail.jsx";

const App = () => (
    <BrowserRouter>
        <AppShell>
            <Routes>
                <Route path="/" element={<Navigate to="/portfolio" replace />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/sync" element={<SyncStatus />} />
                <Route path="/nat" element={<div style={{ color: '#9b8ab4' }}>NAT Distribution — coming soon</div>} />
                <Route path="/collections" element={<div style={{ color: '#9b8ab4' }}>Collections — coming soon</div>} />
                <Route path="/blocks" element={<div style={{ color: '#9b8ab4' }}>Blocks — coming soon</div>} />
                <Route path="/pools" element={<div style={{ color: '#9b8ab4' }}>Pool Rankings — coming soon</div>} />
                <Route path="/perblock" element={<div style={{ color: '#9b8ab4' }}>Per Block — coming soon</div>} />
                <Route path="/token/:ticker" element={<TokenDetail />} />
                <Route path="*" element={<Navigate to="/portfolio" replace />} />
            </Routes>
        </AppShell>
    </BrowserRouter>
);

export default App;