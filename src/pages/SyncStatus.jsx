import { Box, Typography, Paper, Chip } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import { useTranslation } from 'react-i18next';
import { useTracApi } from '../hooks/useTracApi';
import api from '../api/tracApi';

const SyncStatus = () => {
    const { t } = useTranslation();
    const { data: syncPct, loading, error } = useTracApi(() => api.getSyncStatus(), []);

    const isFullyCovered = syncPct !== null && syncPct !== undefined && syncPct >= 1.0;

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <SyncIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h2">{t('nav.syncStatus')}</Typography>
            </Box>

            <Paper sx={{ p: 3, maxWidth: 480 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="overline">TAP protocol index ratio</Typography>
                    <Chip
                        label={loading ? t('common.loading') : syncPct?.toFixed(4)}
                        size="small"
                        color={isFullyCovered ? 'success' : 'warning'}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    <Typography variant="body2">
                        <span style={{ color: '#b8a8cc' }}>Index ratio:</span>{' '}
                        <span style={{ color: '#e8d5ff' }}>{syncPct?.toFixed(4)}</span>{' '}
                        <span style={{ color: '#6b5f8a' }}>
                            {isFullyCovered ? '— full coverage' : '— indexing in progress'}
                        </span>
                    </Typography>
                    <Typography variant="body2">
                        <span style={{ color: '#b8a8cc' }}>Raw Hypercore chunks:</span>{' '}
                        <span style={{ color: '#e8d5ff' }}>~0.9% of 637M chunks</span>
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.disabled', fontSize: '0.75rem' }}>
                        The index ratio measures queryable TAP protocol state — values above 1.0
                        indicate full coverage. Raw Hypercore chunk download is the underlying
                        P2P data layer and is a separate metric.
                    </Typography>
                </Box>

                {error && (
                    <Typography variant="body2" sx={{ mt: 1, color: 'error.main' }}>
                        {error}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default SyncStatus;