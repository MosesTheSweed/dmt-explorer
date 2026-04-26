import { Box, Typography, Paper, Grid, Chip, CircularProgress, IconButton, Tooltip, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTracApi } from '../../hooks/useTracApi';
import api, { formatBalance } from '../../api/tracApi';
import { DEFAULT_WALLETS} from "../../pages/portfolio/constants.js";

const StatCard = ({ label, value, color = 'text.primary', mono = false }) => (
    <Paper sx={{ p: 2 }}>
        <Typography variant="overline" sx={{ display: 'block', lineHeight: 1.2, mb: 0.5 }}>
            {label}
        </Typography>
        <Typography variant="h4" sx={{
            color,
            fontFamily: mono ? 'monospace' : 'inherit',
            wordBreak: 'break-all',
            fontSize: mono ? '0.75rem' : undefined,
        }}>
            {value ?? '—'}
        </Typography>
    </Paper>
);

const ExternalLink = ({ href, label }) => (
    <Tooltip title={`View on ${label}`}>
        <IconButton
            size="small"
            onClick={() => window.open(href, '_blank')}
            sx={{
                border: '0.5px solid #2e2845',
                borderRadius: 1,
                px: 1,
                py: 0.5,
                gap: 0.5,
                '&:hover': { borderColor: 'primary.main', backgroundColor: 'rgba(168,85,247,0.08)' },
            }}
        >
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
            <OpenInNewIcon sx={{ fontSize: 11, color: 'text.disabled' }} />
        </IconButton>
    </Tooltip>
);

const TokenDetail = () => {
    const { ticker } = useParams();
    const navigate = useNavigate();
    const [copiedInscription, setCopiedInscription] = useState(false);
    const decodedTicker = decodeURIComponent(ticker);

    const { data: deployment, loading: deployLoading } = useTracApi(
        () => api.getDeployment(decodedTicker), [decodedTicker]
    );
    const { data: holdersLen } = useTracApi(
        () => api.getHoldersLength(decodedTicker), [decodedTicker]
    );
    const { data: holders } = useTracApi(
        () => api.getHolders(decodedTicker), [decodedTicker]
    );

    const isDmt = deployment?.dmt === true;
    const dec = deployment?.dec ?? 0;
    const inscriptionId = deployment?.ins;

    const fieldLabel = deployment?.dt
        ? ({ n: 'nonce', h: 'block height', b: 'bits' }[deployment.dt] ?? deployment.dt)
        : null;

    const deployDate = deployment?.ts
        ? new Date(deployment.ts * 1000).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        })
        : null;

    const handleCopyInscription = () => {
        if (!inscriptionId) return;
        navigator.clipboard.writeText(inscriptionId);
        setCopiedInscription(true);
        setTimeout(() => setCopiedInscription(false), 2000);
    };

    const externalLinks = [
        {
            label: 'ordinals.com',
            href: `https://ordinals.com/inscription/${inscriptionId}`,
        },
        {
            label: 'unisat.io',
            href: `https://unisat.io/brc20/${decodedTicker}`,
        },
        {
            label: 'trac.network',
            href: `https://trac.network`,
        },
    ].filter(l => l.href);

    if (deployLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 4 }}>
                <CircularProgress size={20} sx={{ color: 'primary.main' }} />
                <Typography variant="body2">Loading token data...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <IconButton size="small" onClick={() => navigate(-1)} sx={{ color: 'text.secondary' }}>
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h2" sx={{ fontFamily: 'monospace' }}>
                    {decodedTicker}
                </Typography>
                {isDmt && (
                    <Chip label="DMT" size="small" sx={{
                        height: 18, fontSize: '0.65rem',
                        backgroundColor: 'rgba(168,85,247,0.15)',
                        color: 'primary.light',
                    }} />
                )}
                {!isDmt && (
                    <Chip label="fungible" size="small" sx={{
                        height: 18, fontSize: '0.65rem',
                        backgroundColor: 'rgba(249,115,22,0.15)',
                        color: 'secondary.main',
                    }} />
                )}
            </Box>

            {/* External links */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                {externalLinks.map(l => (
                    <ExternalLink key={l.label} href={l.href} label={l.label} />
                ))}
            </Box>

            {/* Stats grid */}
            <Grid container spacing={1.5} sx={{ mb: 3 }}>
                <Grid xs={6} sm={3}>
                    <StatCard
                        label="Holders"
                        value={holdersLen != null ? Number(holdersLen).toLocaleString() : null}
                        color="primary.light"
                    />
                </Grid>
                <Grid xs={6} sm={3}>
                    <StatCard
                        label="Max supply"
                        value={deployment?.max
                            ? BigInt(deployment.max) === BigInt('18446744073709551615')
                                ? '2⁶⁴ − 1'
                                : formatBalance(deployment.max, dec)
                            : null}
                    />
                </Grid>
                <Grid xs={6} sm={3}>
                    <StatCard
                        label="Deploy block"
                        value={deployment?.blck != null ? Number(deployment.blck).toLocaleString() : null}
                        color="secondary.main"
                    />
                </Grid>
                <Grid xs={6} sm={3}>
                    <StatCard
                        label="Deploy date"
                        value={deployDate}
                    />
                </Grid>
                {isDmt && fieldLabel && (
                    <Grid xs={6} sm={3}>
                        <StatCard
                            label="DMT field"
                            value={fieldLabel}
                            color="success.main"
                        />
                    </Grid>
                )}
                <Grid xs={6} sm={3}>
                    <StatCard label="Decimals" value={dec} />
                </Grid>
                <Grid xs={6} sm={3}>
                    <StatCard
                        label="Mint limit"
                        value={deployment?.lim
                            ? BigInt(deployment.lim) === BigInt('18446744073709551615')
                                ? 'unlimited'
                                : formatBalance(deployment.lim, dec)
                            : null}
                    />
                </Grid>
            </Grid>

            {/* Inscription ID */}
            {inscriptionId && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Typography variant="overline" sx={{ display: 'block', mb: 1 }}>
                        Deploy inscription
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{
                            fontFamily: 'monospace',
                            color: 'text.secondary',
                            wordBreak: 'break-all',
                            flex: 1,
                        }}>
                            {inscriptionId}
                        </Typography>
                        <Tooltip title={copiedInscription ? 'Copied!' : 'Copy inscription ID'}>
                            <IconButton size="small" onClick={handleCopyInscription} sx={{ p: 0.25 }}>
                                <ContentCopyIcon sx={{
                                    fontSize: 12,
                                    color: copiedInscription ? 'secondary.main' : 'text.disabled',
                                }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Paper>
            )}

            {/* Your balances */}
            <Typography variant="h3" sx={{ mb: 1.5 }}>Your balances</Typography>
            <Grid container spacing={1.5} sx={{ mb: 3 }}>
                {Object.entries(DEFAULT_WALLETS).map(([label, address]) => (
                    <WalletBalanceRow
                        key={address}
                        label={label}
                        address={address}
                        ticker={decodedTicker}
                        dec={dec}
                    />
                ))}
            </Grid>
            {/* Top holders */}
            <Typography variant="h3" sx={{ mb: 1.5 }}>Top holders</Typography>
            {!holders ? (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                        Holder list unavailable — node may still be syncing this data.
                        Try again as sync progresses.
                    </Typography>
                </Paper>
            ) : holders.length === 0 ? (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                        No holders found.
                    </Typography>
                </Paper>
            ) : (
                <Paper sx={{ overflow: 'hidden' }}>
                    {holders
                        .slice()
                        .sort((a, b) => {
                            const balA = BigInt(a.balance ?? a.amt ?? 0);
                            const balB = BigInt(b.balance ?? b.amt ?? 0);
                            return balB > balA ? 1 : balB < balA ? -1 : 0;
                        })
                        .slice(0, 50)
                        .map((holder, i) => (
                        <Box key={holder.address ?? i}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    px: 2,
                                    py: 1,
                                    '&:hover': { backgroundColor: 'rgba(168,85,247,0.05)', cursor: 'pointer' },
                                }}
                                onClick={() => navigate(`/portfolio?address=${holder.address}`)}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Typography variant="caption" sx={{
                                        color: 'text.disabled',
                                        minWidth: 24,
                                        fontFamily: 'monospace',
                                    }}>
                                        {String(i + 1).padStart(2, '0')}
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        fontFamily: 'monospace',
                                        color: 'text.secondary',
                                    }}>
                                        {holder.address}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" sx={{
                                    fontFamily: 'monospace',
                                    color: 'primary.light',
                                    fontWeight: 600,
                                }}>
                                    {formatBalance(String(holder.balance ?? holder.amt ?? 0), dec)}
                                </Typography>
                            </Box>
                            {i < Math.min(holders.length, 20) - 1 && (
                                <Divider sx={{ borderColor: '#2e2845' }} />
                            )}
                        </Box>
                    ))}
                </Paper>
            )}
        </Box>
    );
};

const WalletBalanceRow = ({ label, address, ticker, dec }) => {
    const { data: balance, loading } = useTracApi(
        () => api.getBalance(address, ticker), [address, ticker]
    );
    const { data: transferable } = useTracApi(
        () => api.getTransferable(address, ticker), [address, ticker]
    );

    const formatted = (balance !== null && balance !== undefined)
        ? formatBalance(String(balance), dec)
        : null;
    const formattedTransferable = (transferable !== null && transferable !== undefined)
        ? formatBalance(String(transferable), dec)
        : null;

    return (
        <Grid xs={12} sm={6}>
            <Paper sx={{ p: 2 }}>
                <Typography variant="overline" sx={{ display: 'block', mb: 1 }}>{label}</Typography>
                {loading ? (
                    <CircularProgress size={14} sx={{ color: 'primary.main' }} />
                ) : (
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Box>
                            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                                Total
                            </Typography>
                            <Typography variant="h4" sx={{ color: 'text.primary' }}>
                                {formatted ?? 'not synced'}
                            </Typography>
                        </Box>
                        {formattedTransferable !== null && (
                            <Box>
                                <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                                    Transferable
                                </Typography>
                                <Typography variant="h4" sx={{ color: 'secondary.main' }}>
                                    {formattedTransferable}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Paper>
        </Grid>
    );
};

export default TokenDetail;