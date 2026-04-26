import { useState } from 'react';
import {
    Box, Typography, Paper, Grid, Chip,
    CircularProgress, TextField, InputAdornment
} from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTracApi } from '../../hooks/useTracApi';
import api from '../../api/tracApi';

const FIELD_LABELS = { n: 'nonce', h: 'block height', b: 'bits' };

const CollectionCard = ({ ticker }) => {
    const navigate = useNavigate();
    const { data: deployment, loading } = useTracApi(
        () => api.getDeployment(ticker), [ticker]
    );
    const { data: holdersLen } = useTracApi(
        () => api.getHoldersLength(ticker), [ticker]
    );

    if (loading) return (
        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}>
            <CircularProgress size={16} sx={{ color: 'primary.main' }} />
        </Paper>
    );

    if (!deployment) return null;

    const fieldLabel = deployment.dt
        ? (FIELD_LABELS[deployment.dt] ?? deployment.dt)
        : null;

    const deployDate = deployment.ts
        ? new Date(deployment.ts * 1000).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        })
        : null;

    return (
        <Paper
            onClick={() => navigate(`/token/${encodeURIComponent(ticker)}`)}
            sx={{
                p: 2,
                height: '100%',
                cursor: 'pointer',
                transition: 'border-color 0.15s, background-color 0.15s',
                '&:hover': {
                    borderColor: '#f97316',
                    backgroundColor: 'rgba(249,115,22,0.04)',
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Typography sx={{
                    fontFamily: 'monospace',
                    color: 'primary.light',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    wordBreak: 'break-all',
                    flex: 1,
                    mr: 1,
                }}>
                    {ticker}
                </Typography>
                {fieldLabel && (
                    <Chip
                        label={fieldLabel}
                        size="small"
                        sx={{
                            height: 16,
                            fontSize: '0.6rem',
                            backgroundColor: 'rgba(34,197,94,0.12)',
                            color: 'success.main',
                            flexShrink: 0,
                        }}
                    />
                )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                <Box>
                    <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                        Holders
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'primary.light', fontWeight: 500 }}>
                        {holdersLen != null ? Number(holdersLen).toLocaleString() : '—'}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                        Deploy block
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 500 }}>
                        {deployment.blck ? Number(deployment.blck).toLocaleString() : '—'}
                    </Typography>
                </Box>
                {deployDate && (
                    <Box>
                        <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                            Date
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {deployDate}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                <Chip
                    label="DMT"
                    size="small"
                    sx={{
                        height: 16, fontSize: '0.6rem',
                        backgroundColor: 'rgba(168,85,247,0.15)',
                        color: 'primary.light',
                    }}
                />
                {deployment.dec === 0 && (
                    <Chip
                        label="whole units"
                        size="small"
                        sx={{
                            height: 16, fontSize: '0.6rem',
                            backgroundColor: 'rgba(168,85,247,0.08)',
                            color: 'text.disabled',
                        }}
                    />
                )}
            </Box>
        </Paper>
    );
};

const Collections = () => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState(48);

    const { data: elements, loading: elementsLoading } = useTracApi(
        () => api.getDmtElementsList(), []
    );

    const DMT_TICKERS = elements
        ? elements.map(e => e.tick ?? e).filter(Boolean)
        : [];

    const filteredTickers = DMT_TICKERS.filter(ticker =>
        !search || ticker.toLowerCase().includes(search.toLowerCase())
    );

    const visibleTickers = filteredTickers.slice(0, visibleCount);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setVisibleCount(48);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <CollectionsIcon sx={{ color: 'secondary.main' }} />
                <Typography variant="h2">{t('nav.collections')}</Typography>
                {DMT_TICKERS.length > 0 && (
                    <Chip
                        label={`${DMT_TICKERS.length} collections`}
                        size="small"
                        sx={{
                            backgroundColor: 'rgba(249,115,22,0.12)',
                            color: 'secondary.main',
                            fontSize: '0.7rem',
                        }}
                    />
                )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    placeholder="Search collections..."
                    value={search}
                    onChange={handleSearch}
                    size="small"
                    sx={{
                        width: 280,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'background.paper',
                            '& fieldset': { borderColor: '#2e2845' },
                            '&:hover fieldset': { borderColor: 'primary.dark' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                        },
                        '& input': { color: 'text.primary', fontSize: '0.8125rem' },
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                {filteredTickers.length > 0 && (
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        {visibleTickers.length} of {filteredTickers.length} shown
                    </Typography>
                )}
            </Box>

            {elementsLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={18} sx={{ color: 'primary.main' }} />
                    <Typography variant="body2">Loading DMT collections...</Typography>
                </Box>
            )}

            {!elementsLoading && DMT_TICKERS.length === 0 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                        No DMT collections found — node may still be syncing.
                    </Typography>
                </Paper>
            )}

            {visibleTickers.length > 0 && (
                <Grid container spacing={1.5}>
                    {visibleTickers.map(ticker => (
                        <Grid xs={12} sm={6} md={4} lg={3} key={ticker}>
                            <CollectionCard ticker={ticker} />
                        </Grid>
                    ))}

                    {visibleCount < filteredTickers.length && (
                        <Grid xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Box
                                    onClick={() => setVisibleCount(v => v + 48)}
                                    sx={{
                                        background: 'rgba(168,85,247,0.1)',
                                        border: '0.5px solid #a855f7',
                                        color: '#c084fc',
                                        px: 3,
                                        py: 1,
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        fontSize: '0.8125rem',
                                        '&:hover': {
                                            background: 'rgba(168,85,247,0.18)',
                                        },
                                    }}
                                >
                                    Load more ({filteredTickers.length - visibleCount} remaining)
                                </Box>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            )}

            {!elementsLoading && filteredTickers.length === 0 && DMT_TICKERS.length > 0 && (
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                    No collections match your search.
                </Typography>
            )}
        </Box>
    );
};

export default Collections;