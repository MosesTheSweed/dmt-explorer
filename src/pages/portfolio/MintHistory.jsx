import { useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Chip, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTracApi } from '../../hooks/useTracApi';
import api from '../../api/tracApi';

const MintHistoryRow = ({ inscriptionId, index }) => {
    const { data: mint, loading } = useTracApi(
        () => api.getDmtMintHolder(inscriptionId), [inscriptionId]
    );

    if (loading) return (
        <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={10} sx={{ color: 'primary.main' }} />
            <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace', fontSize: '0.65rem' }}>
                {inscriptionId.slice(0, 16)}...
            </Typography>
        </Box>
    );

    if (!mint) return null;

    const isCurrentOwner = mint.ownr === mint.prv;
    const date = mint.ts ? new Date(mint.ts * 1000).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    }) : null;

    return (
        <Box>
            <Box sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                px: 2, py: 1,
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(168,85,247,0.04)' },
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
                            <Chip label={mint.tick} size="small" sx={{
                                height: 14, fontSize: '0.55rem',
                                backgroundColor: 'var(--tint-purple-lg)',
                                color: 'primary.light',
                            }} />
                            {mint.elem?.pat && (
                                <Chip label={`pattern: ${mint.elem.pat}`} size="small" sx={{
                                    height: 14, fontSize: '0.55rem',
                                    backgroundColor: 'var(--tint-green-md)',
                                    color: 'success.main',
                                }} />
                            )}
                            {!isCurrentOwner && (
                                <Chip label="transferred" size="small" sx={{
                                    height: 14, fontSize: '0.55rem',
                                    backgroundColor: 'var(--tint-orange-md)',
                                    color: 'secondary.main',
                                }} />
                            )}
                        </Box>
                        <Typography variant="caption" sx={{
                            color: 'text.disabled', fontSize: '0.65rem', display: 'block'
                        }}>
                            BTC block {mint.dmtblck?.toLocaleString()} · {date}
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="caption" sx={{
                    fontFamily: 'monospace', color: 'text.disabled',
                    fontSize: '0.65rem',
                }}>
                    #{mint.num?.toLocaleString()}
                </Typography>
            </Box>
            <Divider sx={{ borderColor: 'var(--border-subtle)' }} />
        </Box>
    );
};
const MintHistory = ({ address, modal = false }) => {
    const [expanded, setExpanded] = useState(true);
    const [visibleCount, setVisibleCount] = useState(20);

    const { data: length } = useTracApi(
        () => api.getDmtMintWalletHistoricListLength(address), [address]
    );
    const { data: inscriptions, loading } = useTracApi(
        () => (modal || expanded) ? api.getDmtMintWalletHistoricList(address) : Promise.resolve(null),
        [address, expanded, modal]
    );

    if (!length || length === 0) return null;

    const listContent = (
        <Paper sx={{ overflow: 'hidden' }}>
            {loading && (
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={14} sx={{ color: 'primary.main' }} />
                    <Typography variant="body2">Loading mint history...</Typography>
                </Box>
            )}
            {inscriptions && (
                <>
                    {inscriptions.slice(0, visibleCount).map((id, i) => (
                        <MintHistoryRow key={id} inscriptionId={id} index={i} />
                    ))}
                    {visibleCount < inscriptions.length && (
                        <Box
                            onClick={() => setVisibleCount(v => v + 20)}
                            sx={{
                                p: 1.5, textAlign: 'center', cursor: 'pointer',
                                color: 'primary.light', fontSize: '0.8rem',
                                '&:hover': { backgroundColor: 'var(--tint-purple-xs)' },
                            }}
                        >
                            Load more ({inscriptions.length - visibleCount} remaining)
                        </Box>
                    )}
                </>
            )}
        </Paper>
    );

    if (modal) return listContent;

    return (
        <Box sx={{ mb: 3 }}>
            <Box
                onClick={() => setExpanded(e => !e)}
                sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', mb: 1,
                    '&:hover': { '& .title': { color: 'primary.light' } },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography className="title" variant="h3" sx={{ transition: 'color 0.15s' }}>
                        Mint history
                    </Typography>
                    <Chip label={length} size="small" sx={{
                        height: 18, fontSize: '0.65rem',
                        backgroundColor: 'var(--tint-purple-md)',
                        color: 'primary.light',
                    }} />
                </Box>
                {expanded
                    ? <ExpandLessIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                    : <ExpandMoreIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                }
            </Box>
            {expanded && listContent}
        </Box>
    );
};

export default MintHistory;