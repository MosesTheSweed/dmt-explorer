import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CollectionsIcon from '@mui/icons-material/Collections';
import MemoryIcon from '@mui/icons-material/Memory';
import BarChartIcon from '@mui/icons-material/BarChart';
import GridViewIcon from '@mui/icons-material/GridView';
import SyncIcon from '@mui/icons-material/Sync';
import { useTranslation } from 'react-i18next';

const DRAWER_WIDTH = 220;

const NAV_SECTIONS = [
    {
        groupKey: 'nav.overview',
        items: [
            { key: 'nat', labelKey: 'nav.natDistribution', icon: <BarChartIcon fontSize="small" /> },
            { key: 'portfolio', labelKey: 'nav.myPortfolio', icon: <AccountBalanceWalletIcon fontSize="small" /> },
            { key: 'sync', labelKey: 'nav.syncStatus', icon: <SyncIcon fontSize="small" /> },
        ],
    },
    {
        groupKey: 'nav.collections',
        items: [
            { key: 'collections', labelKey: 'nav.collections', icon: <CollectionsIcon fontSize="small" /> },
            { key: 'blocks', labelKey: 'nav.blocks', icon: <GridViewIcon fontSize="small" /> },
        ],
    },
    {
        groupKey: 'nav.miners',
        items: [
            { key: 'pools', labelKey: 'nav.poolRankings', icon: <MemoryIcon fontSize="small" /> },
            { key: 'perblock', labelKey: 'nav.perBlock', icon: <DashboardIcon fontSize="small" /> },
        ],
    },
];

export default function Sidebar({ activePage, onNavigate }) {
    const { t } = useTranslation();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
            }}
        >
            <Box sx={{ px: 2, py: 2, borderBottom: '0.5px solid #2e2845' }}>
                <Typography variant="h3" sx={{ color: 'text.primary' }}>
                    DMT <span style={{ color: '#f97316' }}>Explorer</span>
                </Typography>
                <Typography variant="caption">
                    {t('app.tagline')}
                </Typography>
            </Box>

            <Box sx={{ overflow: 'auto', pt: 1 }}>
                {NAV_SECTIONS.map((section, si) => (
                    <Box key={si}>
                        <Typography
                            variant="overline"
                            sx={{ px: 2, pt: 1.5, pb: 0.5, display: 'block' }}
                        >
                            {t(section.groupKey)}
                        </Typography>
                        <List dense disablePadding>
                            {section.items.map((item) => (
                                <ListItemButton
                                    key={item.key}
                                    selected={activePage === item.key}
                                    onClick={() => onNavigate(item.key)}
                                    sx={{ pl: 2, py: 0.75 }}
                                >
                                    <ListItemIcon sx={{ minWidth: 32, color: activePage === item.key ? 'primary.main' : 'text.disabled' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={t(item.labelKey)}
                                        primaryTypographyProps={{
                                            fontSize: '0.8125rem',
                                            color: activePage === item.key ? 'text.primary' : 'text.secondary',
                                        }}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                        {si < NAV_SECTIONS.length - 1 && <Divider sx={{ mt: 1 }} />}
                    </Box>
                ))}
            </Box>
        </Drawer>
    );
}

export { DRAWER_WIDTH };