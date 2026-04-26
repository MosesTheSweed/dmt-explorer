import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import SyncStatus from './pages/SyncStatus';
import Portfolio from './pages/portfolio/index.jsx';
import TokenDetail from "./components/tokens/TokenDetail.jsx";
import Collections from './pages/collections/index.jsx';
import NatDistribution from "./pages/nat/index.jsx";
import CollectionGallery from "./pages/collectionGallery/index.jsx";

const App = () => (
    <BrowserRouter>
        <AppShell>
            <Routes>
                <Route path="/" element={<Navigate to="/portfolio" replace />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/sync" element={<SyncStatus />} />
                <Route path="/nat" element={<NatDistribution />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/collection/:ticker" element={<CollectionGallery />} />
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