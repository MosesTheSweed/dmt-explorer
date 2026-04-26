import { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, CircularProgress, Chip, Divider,
    ToggleButtonGroup, ToggleButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTracApi } from '../../hooks/useTracApi';
import api from '../../api/tracApi';
import { getRenderer } from '../../data/collectionRenderers';
import { classifyMint, currentRecord } from '../../data/mintHistory';

const STATUS_CHIPS = {
    owned: null, // no chip for owned, it's the default
    transferred: {
        label: 'transferred',
        bg: 'var(--tint-orange-md)',
        color: 'secondary.main',
    },
    'lost-race': {
        label: 'lost race',
        bg: 'var(--tint-purple-sm)',
        color: 'text.disabled',
    },
};

const MintHistoryRow = ({ inscriptionId, mint, status, index, address }) => {
    const [previewDismissed, setPreviewDismissed] = useState(false);

    const renderer = getRenderer(mint.tick);
    const showPreview = !!renderer && !previewDismissed;
    const date = mint.ts ? new Date(mint.ts * 1000).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    }) : null;
    const statusChip = STATUS_CHIPS[status];
    const dimmed = status !== 'owned';

    return (
        <Box>
            <Box sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                px: 2, py: 1, cursor: 'pointer',
                opacity: dimmed ? 0.4 : 1,
                transition: 'opacity 0.15s',
                '&:hover': {
                    backgroundColor: 'var(--tint-purple-xxs)',
                    opacity: 1,
                },
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
                            {statusChip && (
                                <Chip label={statusChip.label} size="small" sx={{
                                    height: 14, fontSize: '0.55rem',
                                    backgroundColor: statusChip.bg,
                                    color: statusChip.color,
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {renderer && (
                        <Box
                            onClick={e => { e.stopPropagation(); setPreviewDismissed(v => !v); }}
                            sx={{
                                fontSize: '0.65rem', color: 'text.disabled', cursor: 'pointer',
                                px: 0.75, py: 0.25, borderRadius: 0.5,
                                border: '0.5px solid var(--border-subtle)',
                                '&:hover': { color: 'primary.light', borderColor: 'primary.main' },
                            }}
                        >
                            {showPreview ? 'hide' : 'art'}
                        </Box>
                    )}
                    <Typography variant="caption" sx={{
                        fontFamily: 'monospace', color: 'text.disabled', fontSize: '0.65rem',
                    }}>
                        #{mint.num?.toLocaleString()}
                    </Typography>
                </Box>
            </Box>

            {showPreview && renderer && mint.dmtblck && (
                <Box sx={{ px: 2, pb: 1, opacity: dimmed ? 0.4 : 1 }}>
                    <renderer.component blockNumber={mint.dmtblck} size={160} />
                </Box>
            )}

            <Divider sx={{ borderColor: 'var(--border-subtle)' }} />
        </Box>
    );
};

const MintHistory = ({ address, modal = false }) => {
    const [expanded, setExpanded] = useState(true);
    const [visibleCount, setVisibleCount] = useState(20);
    const [filter, setFilter] = useState('owned');

    const { data: length } = useTracApi(
        () => api.getDmtMintWalletHistoricListLength(address), [address]
    );
    const { data: inscriptions, loading: idsLoading } = useTracApi(
        () => (modal || expanded) ? api.getDmtMintWalletHistoricList(address) : Promise.resolve(null),
        [address, expanded, modal]
    );

    // Hydrate using holder history — gives us classification + current record in one call
    const [hydrated, setHydrated] = useState(null);
    const [hydrating, setHydrating] = useState(false);

    useEffect(() => {
        if (!inscriptions) return;
        const unique = [...new Set(inscriptions)];
        let cancelled = false;
        setHydrating(true);

        Promise.all(
            unique.map(id =>
                api.getDmtMintHoldersHistoryList(id)
                    .then(history => ({ id, history }))
                    .catch(() => ({ id, history: null }))
            )
        ).then(results => {
            if (cancelled) return;
            const enriched = results
                .filter(r => r.history)
                .map(({ id, history }) => ({
                    id,
                    history,
                    mint: currentRecord(history),
                    status: classifyMint(history, address),
                }));
            setHydrated(enriched);
            setHydrating(false);
        });

        return () => { cancelled = true; };
    }, [inscriptions, address]);

    if (!length || length === 0) return null;

    const counts = hydrated ? {
        all: hydrated.length,
        owned: hydrated.filter(h => h.status === 'owned').length,
        transferred: hydrated.filter(h => h.status === 'transferred').length,
        'lost-race': hydrated.filter(h => h.status === 'lost-race').length,
    } : null;

    const visible = hydrated
        ? (filter === 'all' ? hydrated : hydrated.filter(h => h.status === filter))
        : [];
    const displayed = visible.slice(0, visibleCount);
    const loading = idsLoading || hydrating;

    const listContent = (
        <Box>
            {hydrated && counts && (
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap',
                    px: 2, py: 1.5,
                    borderBottom: '0.5px solid var(--border-subtle)',
                }}>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        Show:
                    </Typography>
                    <ToggleButtonGroup
                        value={filter}
                        exclusive
                        onChange={(_, v) => { if (v) { setFilter(v); setVisibleCount(20); } }}
                        size="small"
                    >
                        {[
                            { value: 'all', label: `All (${counts.all})` },
                            { value: 'owned', label: `Owned (${counts.owned})` },
                            { value: 'transferred', label: `Transferred (${counts.transferred})` },
                            { value: 'lost-race', label: `Lost races (${counts['lost-race']})` },
                        ].map(opt => (
                            <ToggleButton key={opt.value} value={opt.value} sx={{
                                py: 0.25, px: 1, fontSize: '0.7rem',
                                color: 'text.secondary', borderColor: 'var(--border-subtle)',
                                '&.Mui-selected': {
                                    backgroundColor: 'var(--tint-purple-md) !important',
                                    color: 'primary.light',
                                    borderColor: 'primary.main',
                                },
                            }}>
                                {opt.label}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>
            )}

            <Paper sx={{
                overflow: 'hidden', borderTop: 'none',
                borderTopLeftRadius: 0, borderTopRightRadius: 0,
            }}>
                {loading && (
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={14} sx={{ color: 'primary.main' }} />
                        <Typography variant="body2">Loading mint history...</Typography>
                    </Box>
                )}
                {!loading && hydrated && visible.length === 0 && (
                    <Box sx={{ p: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                            No mints match the current filter.
                        </Typography>
                    </Box>
                )}
                {!loading && displayed.map(({ id, mint, status }, i) => (
                    <MintHistoryRow
                        key={id}
                        inscriptionId={id}
                        mint={mint}
                        status={status}
                        index={i}
                        address={address}
                    />
                ))}
                {!loading && visibleCount < visible.length && (
                    <Box
                        onClick={() => setVisibleCount(v => v + 20)}
                        sx={{
                            p: 1.5, textAlign: 'center', cursor: 'pointer',
                            color: 'primary.light', fontSize: '0.8rem',
                            '&:hover': { backgroundColor: 'var(--tint-purple-xs)' },
                        }}
                    >
                        Load more ({visible.length - visibleCount} remaining)
                    </Box>
                )}
            </Paper>
        </Box>
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