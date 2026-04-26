import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Grid, CircularProgress, Chip, Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTracApi } from '../../hooks/useTracApi';
import api from '../../api/tracApi';
import { getRenderer } from '../../data/collectionRenderers';

const GalleryTile = ({ inscriptionId, ticker, renderer }) => {
    const { data: mint, loading } = useTracApi(
        () => api.getDmtMintHolder(inscriptionId), [inscriptionId]
    );

    if (loading) {
        return (
            <Paper sx={{
                aspectRatio: '1', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
            }}>
                <CircularProgress size={16} sx={{ color: 'primary.main' }} />
            </Paper>
        );
    }

    if (!mint || mint.tick !== ticker) return null;

    const date = mint.ts ? new Date(mint.ts * 1000).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    }) : null;

    return (
        <Paper
            onClick={() => window.open(`https://ordinals.com/inscription/${inscriptionId}`, '_blank')}
            sx={{
                p: 1.5,
                cursor: 'pointer',
                transition: 'border-color 0.15s, background-color 0.15s',
                '&:hover': {
                    borderColor: 'primary.main !important',
                    backgroundColor: 'var(--tint-purple-xs)',
                },
            }}
        >
            <Box sx={{
                display: 'flex', justifyContent: 'center',
                alignItems: 'center', mb: 1,
            }}>
                <renderer.component blockNumber={mint.dmtblck} size={200} />
            </Box>
            <Box sx={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', mb: 0.5,
            }}>
                <Typography variant="caption" sx={{
                    fontFamily: 'monospace', color: 'primary.light', fontSize: '0.65rem',
                }}>
                    #{mint.num?.toLocaleString()}
                </Typography>
                {mint.elem?.pat && (
                    <Chip label={mint.elem.pat} size="small" sx={{
                        height: 14, fontSize: '0.55rem',
                        backgroundColor: 'var(--tint-green-md)',
                        color: 'success.main',
                    }} />
                )}
            </Box>
            <Typography variant="caption" sx={{
                color: 'text.disabled', fontSize: '0.6rem', display: 'block',
            }}>
                block {mint.dmtblck?.toLocaleString()}
            </Typography>
            {date && (
                <Typography variant="caption" sx={{
                    color: 'text.disabled', fontSize: '0.6rem', display: 'block',
                }}>
                    {date}
                </Typography>
            )}
        </Paper>
    );
};

const CollectionGallery = () => {
    const { ticker } = useParams();
    const [searchParams] = useSearchParams();
    const address = searchParams.get('address');
    const navigate = useNavigate();

    const renderer = getRenderer(ticker);
    const { data: mintIds, loading: mintsLoading } = useTracApi(
        () => address ? api.getDmtMintWalletHistoricList(address) : Promise.resolve(null),
        [address]
    );
    const { data: fungibleBalance } = useTracApi(
        () => address ? api.getBalance(address, ticker) : Promise.resolve(null),
        [address, ticker]
    );

    // Hydrate mints in batches so we can filter by ticker + ownership
    // before rendering. We do this here (not in tiles) so the header
    // counts are accurate.
    const [hydrated, setHydrated] = useState(null);
    const [hydrating, setHydrating] = useState(false);

    useEffect(() => {
        if (!mintIds || !address) return;
        const unique = [...new Set(mintIds)];
        let cancelled = false;
        setHydrating(true);

        Promise.all(
            unique.map(id =>
                api.getDmtMintHolder(id)
                    .then(m => ({ id, mint: m }))
                    .catch(() => ({ id, mint: null }))
            )
        ).then(results => {
            if (cancelled) return;
            const filtered = results.filter(({ mint }) =>
                mint && mint.tick === ticker
            );
            setHydrated(filtered);
            setHydrating(false);
        });

        return () => { cancelled = true; };
    }, [mintIds, address, ticker]);

    if (!renderer) {
        return (
            <Box>
                <Box
                    onClick={() => navigate(-1)}
                    sx={{
                        display: 'flex', alignItems: 'center', gap: 0.5,
                        cursor: 'pointer', mb: 2, color: 'text.disabled',
                        '&:hover': { color: 'primary.light' },
                    }}
                >
                    <ArrowBackIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption">back</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                    No renderer registered for {ticker}.
                </Typography>
            </Box>
        );
    }

    if (!address) {
        return (
            <Box>
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                    No address provided. Use ?address=... in the URL.
                </Typography>
            </Box>
        );
    }

    const ownedTiles = hydrated
        ? hydrated.filter(({ mint }) => mint.ownr === address)
        : null;
    const ownedCount = ownedTiles?.length ?? null;
    const loading = mintsLoading || hydrating;

    return (
        <Box>
            {/* Back link */}
            <Box
                onClick={() => navigate(`/token/${encodeURIComponent(ticker)}`)}
                sx={{
                    display: 'flex', alignItems: 'center', gap: 0.5,
                    cursor: 'pointer', mb: 2, color: 'text.disabled',
                    '&:hover': { color: 'primary.light' },
                    width: 'fit-content',
                }}
            >
                <ArrowBackIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption">back to {ticker}</Typography>
            </Box>

            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h2" sx={{ fontFamily: 'monospace' }}>
                    {ticker}
                </Typography>
                <Chip label="gallery" size="small" sx={{
                    height: 18, fontSize: '0.65rem',
                    backgroundColor: 'var(--tint-purple-md)',
                    color: 'primary.light',
                }} />
            </Box>
            <Typography variant="caption" sx={{
                fontFamily: 'monospace', color: 'text.disabled', display: 'block', mb: 2,
            }}>
                {address}
            </Typography>

            {/* Counts */}
            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                <Box>
                    <Typography variant="caption" sx={{
                        color: 'text.disabled', display: 'block',
                        fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: 0.5,
                    }}>
                        Fungible balance
                    </Typography>
                    <Typography variant="h3" sx={{ color: 'primary.light' }}>
                        {fungibleBalance ?? '—'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>
                        from successful mints
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" sx={{
                        color: 'text.disabled', display: 'block',
                        fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: 0.5,
                    }}>
                        Art owned
                    </Typography>
                    <Typography variant="h3" sx={{ color: 'secondary.main' }}>
                        {ownedCount ?? '—'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>
                        inscriptions held
                    </Typography>
                </Box>
            </Box>

            {/* Note about scope */}
            <Typography variant="caption" sx={{
                color: 'text.disabled', display: 'block', mb: 3, fontSize: '0.65rem',
            }}>
                Showing inscriptions you minted that you still own. Art purchased
                on secondary won't appear here yet.
            </Typography>

            {/* Loading */}
            {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={14} sx={{ color: 'primary.main' }} />
                    <Typography variant="body2">Loading collection...</Typography>
                </Box>
            )}

            {/* Empty state */}
            {!loading && ownedTiles && ownedTiles.length === 0 && (
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                    No {ticker} inscriptions currently owned at this address.
                </Typography>
            )}

            {/* Grid */}
            {ownedTiles && ownedTiles.length > 0 && (
                <Grid container spacing={1.5}>
                    {ownedTiles.map(({ id }) => (
                        <Grid xs={6} sm={4} md={3} lg={2} key={id}>
                            <GalleryTile
                                inscriptionId={id}
                                ticker={ticker}
                                renderer={renderer}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default CollectionGallery;