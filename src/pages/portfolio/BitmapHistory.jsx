import { useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Chip, Divider } from '@mui/material';
import { useTracApi } from '../../hooks/useTracApi';
import api from '../../api/tracApi';

const BitmapRow = ({ inscriptionId, index }) => {
    const { data: bitmap, loading } = useTracApi(
        () => api.getBitmapByInscription(inscriptionId), [inscriptionId]
    );

    if (loading) return (
        <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={10} sx={{ color: 'primary.main' }} />
            <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace', fontSize: '0.65rem' }}>
                {inscriptionId.slice(0, 16)}...
            </Typography>
        </Box>
    );

    if (!bitmap) return null;

    const isCurrentOwner = bitmap.ownr === bitmap.prv;
    const date = bitmap.ts ? new Date(bitmap.ts * 1000).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    }) : null;

    return (
        <Box>
            <Box sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                px: 2, py: 1, cursor: 'pointer',
                '&:hover': { backgroundColor: 'var(--tint-purple-xxs)' },
            }}
                 onClick={() => window.open(`https://ordinals.com/inscription/${inscriptionId}`, '_blank')}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="caption" sx={{
                        color: 'text.disabled', minWidth: 24, fontFamily: 'monospace'
                    }}>
                        {String(index + 1).padStart(2, '0')}
                    </Typography>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                                label={`${bitmap.bm?.toLocaleString()}.bitmap`}
                                size="small"
                                sx={{
                                    height: 14, fontSize: '0.55rem',
                                    backgroundColor: 'var(--tint-orange-md)',
                                    color: 'secondary.main',
                                }}
                            />
                            {!isCurrentOwner && (
                                <Chip label="transferred" size="small" sx={{
                                    height: 14, fontSize: '0.55rem',
                                    backgroundColor: 'var(--tint-purple-md)',
                                    color: 'primary.light',
                                }} />
                            )}
                        </Box>
                        <Typography variant="caption" sx={{
                            color: 'text.disabled', fontSize: '0.65rem', display: 'block'
                        }}>
                            inscribed block {bitmap.blck?.toLocaleString()} · {date}
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="caption" sx={{
                    fontFamily: 'monospace', color: 'text.disabled', fontSize: '0.65rem',
                }}>
                    #{bitmap.num?.toLocaleString()}
                </Typography>
            </Box>
            <Divider sx={{ borderColor: 'var(--border-subtle)' }} />
        </Box>
    );
};

const BitmapHistory = ({ address, modal = false }) => {
    const [visibleCount, setVisibleCount] = useState(20);

    const { data: length } = useTracApi(
        () => api.getBitmapWalletHistoricListLength(address), [address]
    );
    const { data: inscriptions, loading } = useTracApi(
        () => modal ? api.getBitmapWalletHistoricList(address) : Promise.resolve(null),
        [address, modal]
    );

    if (!length || length === 0) return null;

    return (
        <Paper sx={{ overflow: 'hidden' }}>
            {loading && (
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={14} sx={{ color: 'primary.main' }} />
                    <Typography variant="body2">Loading bitmap history...</Typography>
                </Box>
            )}
            {inscriptions && (
                <>
                    {[...new Set(inscriptions)].slice(0, visibleCount).map((id, i) => (
                        <BitmapRow key={id} inscriptionId={id} index={i} />
                    ))}
                    {visibleCount < [...new Set(inscriptions)].length && (
                        <Box
                            onClick={() => setVisibleCount(v => v + 20)}
                            sx={{
                                p: 1.5, textAlign: 'center', cursor: 'pointer',
                                color: 'primary.light', fontSize: '0.8rem',
                                '&:hover': { backgroundColor: 'var(--tint-purple-xs)' },
                            }}
                        >
                            Load more ({[...new Set(inscriptions)].length - visibleCount} remaining)
                        </Box>
                    )}
                </>
            )}
        </Paper>
    );
};

export default BitmapHistory;