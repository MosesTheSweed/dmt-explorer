import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CollectionsIcon from '@mui/icons-material/Collections';
import MemoryIcon from '@mui/icons-material/Memory';
import BarChartIcon from '@mui/icons-material/BarChart';
import GridViewIcon from '@mui/icons-material/GridView';
import SyncIcon from '@mui/icons-material/Sync';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 220;

const NAV_SECTIONS = [
    {
        groupKey: 'nav.overview',
        accent: 'primary.main',
        items: [
            { path: '/nat', labelKey: 'nav.natDistribution', icon: <BarChartIcon fontSize="small" /> },
            { path: '/portfolio', labelKey: 'nav.myPortfolio', icon: <AccountBalanceWalletIcon fontSize="small" /> },
            { path: '/sync', labelKey: 'nav.syncStatus', icon: <SyncIcon fontSize="small" /> },
        ],
    },
    {
        groupKey: 'nav.collections',
        accent: 'secondary.main',
        items: [
            { path: '/collections', labelKey: 'nav.collections', icon: <CollectionsIcon fontSize="small" /> },
            { path: '/blocks', labelKey: 'nav.blocks', icon: <GridViewIcon fontSize="small" /> },
        ],
    },
    {
        groupKey: 'nav.miners',
        accent: 'success.main',
        items: [
            { path: '/pools', labelKey: 'nav.poolRankings', icon: <MemoryIcon fontSize="small" /> },
            { path: '/perblock', labelKey: 'nav.perBlock', icon: <DashboardIcon fontSize="small" /> },
        ],
    },
];

const Sidebar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const activeAccent = NAV_SECTIONS
        .find(s => s.items.some(i => location.pathname.startsWith(i.path)))?.accent ?? 'primary.main';

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
            }}
        >
            <Box sx={{ px: 2, py: 2, borderBottom: '0.5px solid var(--border-subtle)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h3" sx={{ color: 'text.primary' }}>
                        DMT <span style={{ color: 'secondary.main' }}>Explorer</span>
                    </Typography>
                    <Box sx={{
                        width: 6, height: 6, borderRadius: '50%',
                        backgroundColor: 'success.main',
                        boxShadow: '0 0 6px success.main',
                        flexShrink: 0, mb: -0.5,
                    }} />
                </Box>
                <Typography variant="caption">{t('app.tagline')}</Typography>
            </Box>

            <Box sx={{ overflow: 'auto', pt: 1 }}>
                {NAV_SECTIONS.map((section, si) => (
                    <Box key={si}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, pt: 1.5, pb: 0.5 }}>
                            <Box sx={{
                                width: 3, height: 3, borderRadius: '50%',
                                backgroundColor: section.accent, flexShrink: 0,
                            }} />
                            <Typography variant="overline">{t(section.groupKey)}</Typography>
                        </Box>
                        <List dense disablePadding>
                            {section.items.map((item) => {
                                const isActive = location.pathname.startsWith(item.path);
                                return (
                                    <ListItemButton
                                        key={item.path}
                                        selected={isActive}
                                        onClick={() => navigate(item.path)}
                                        sx={{
                                            pl: 2, py: 0.75,
                                            borderLeft: isActive
                                                ? `2px solid ${section.accent}`
                                                : '2px solid transparent',
                                            '&.Mui-selected': {
                                                backgroundColor: `${section.accent}14`,
                                                '&:hover': { backgroundColor: `${section.accent}20` },
                                            },
                                            '&:hover': { backgroundColor: `${section.accent}0a` },
                                        }}
                                    >
                                        <ListItemIcon sx={{
                                            minWidth: 32,
                                            color: isActive ? section.accent : 'text.disabled',
                                        }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={t(item.labelKey)}
                                            slotProps={{
                                                primary: {
                                                    fontSize: '0.8125rem',
                                                    color: isActive ? 'text.primary' : 'text.secondary',
                                                }
                                            }}
                                        />
                                    </ListItemButton>
                                );
                            })}
                        </List>
                        {si < NAV_SECTIONS.length - 1 && <Divider sx={{ mt: 1 }} />}
                    </Box>
                ))}
            </Box>

            <Box sx={{
                mt: 'auto', px: 2, py: 1.5,
                borderTop: '0.5px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', gap: 1,
            }}>
                <Box sx={{
                    width: 6, height: 6, borderRadius: '50%',
                    backgroundColor: activeAccent, flexShrink: 0,
                }} />
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    holmes node
                </Typography>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
export { DRAWER_WIDTH };