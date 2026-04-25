import { Box, Typography, LinearProgress, Paper, Chip } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import { useTranslation } from 'react-i18next';
import { useTracApi } from '../hooks/useTracApi';
import api from '../api/tracApi';

export default function SyncStatus() {
    const { t } = useTranslation();
    const { data: syncPct, loading, error } = useTracApi(() => api.getSyncStatus(), []);

    const pct = syncPct !== null && syncPct !== undefined ? (syncPct * 100) : 0;

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <SyncIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h2">{t('nav.syncStatus')}</Typography>
            </Box>

            <Paper sx={{ p: 3, maxWidth: 480 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="overline">{t('metrics.syncProgress')}</Typography>
                    <Chip
                        label={loading ? t('common.loading') : `${pct.toFixed(4)}%`}
                        size="small"
                        color={pct > 50 ? 'success' : 'warning'}
                    />
                </Box>
                <LinearProgress
                    variant={loading ? 'indeterminate' : 'determinate'}
                    value={Math.min(pct, 100)}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#2e2845',
                        '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #7e22ce, #f97316)',
                            borderRadius: 4,
                        },
                    }}
                />
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    Holmes node syncing TAP protocol state from the Trac P2P network.
                    Full sync required for complete data availability.
                </Typography>
                {error && (
                    <Typography variant="body2" sx={{ mt: 1, color: 'error.main' }}>
                        {error}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
}