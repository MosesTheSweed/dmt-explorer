import { useState } from 'react';
import {
    Box, Typography, Grid, CircularProgress,
    Tooltip, IconButton, Dialog, DialogTitle,
    DialogContent, Chip,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { useTracApi } from '../../hooks/useTracApi';
import api from '../../api/tracApi';
import TokenCard from '../../components/tokens/TokenCard';
import WalletHeader from './WalletHeader.jsx';
import MintHistory from './MintHistory.jsx';
import HistoryIcon from '@mui/icons-material/History';
import { PINNED_TOKENS } from './constants';

const applyFilterAndSort = (tokens, filter, sort) => {
    if (!tokens) return [];
    let result = [...tokens];
    if (filter === 'dmt') result = result.filter(t => t.startsWith('dmt-'));
    else if (filter === 'fungible') result = result.filter(t => !t.startsWith('dmt-'));
    if (sort === 'name') result.sort((a, b) => a.localeCompare(b));
    else if (sort === 'name-desc') result.sort((a, b) => b.localeCompare(a));
    else if (sort === 'dmt-first') {
        result.sort((a, b) => {
            const aDmt = a.startsWith('dmt-') ? 0 : 1;
            const bDmt = b.startsWith('dmt-') ? 0 : 1;
            return aDmt - bDmt || a.localeCompare(b);
        });
    }
    return result;
};

const WalletSection = ({ label, address, pinned = [] }) => {
    const [copied, setCopied] = useState(false);
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('dmt-first');
    const [historyOpen, setHistoryOpen] = useState(false);
    const { t } = useTranslation();

    const { data: mintCount } = useTracApi(
        () => api.getDmtMintWalletHistoricListLength(address), [address]
    );
    const { data: tokens, loading, error } = useTracApi(
        () => api.getAccountTokens(address), [address]
    );

    const resolvedPinned = pinned.length > 0 ? pinned : (PINNED_TOKENS[address] ?? []);
    const allTokens = tokens
        ? [...new Set([...resolvedPinned, ...tokens])]
        : resolvedPinned.length > 0 ? resolvedPinned : null;

    const displayTokens = applyFilterAndSort(allTokens, filter, sort);

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Box sx={{ mb: 4 }}>
            {/* Wallet label row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <AccountBalanceWalletIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                <Typography variant="h4">{label}</Typography>
                {mintCount > 0 && (
                    <Chip
                        icon={<HistoryIcon sx={{ fontSize: '12px !important' }} />}
                        label={`${mintCount} mints`}
                        size="small"
                        onClick={() => setHistoryOpen(true)}
                        sx={{
                            height: 18, fontSize: '0.65rem', cursor: 'pointer',
                            backgroundColor: 'rgba(168,85,247,0.12)',
                            color: 'primary.light',
                            border: '0.5px solid rgba(168,85,247,0.3)',
                            '&:hover': {
                                backgroundColor: 'rgba(168,85,247,0.22)',
                                borderColor: 'primary.light',
                            },
                        }}
                    />
                )}
            </Box>

            {/* Address + copy */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                    {address}
                </Typography>
                <Tooltip title={copied ? 'Copied!' : 'Copy address'}>
                    <IconButton size="small" onClick={handleCopy} sx={{ p: 0.25 }}>
                        <ContentCopyIcon sx={{
                            fontSize: 12,
                            color: copied ? 'secondary.main' : 'text.disabled',
                        }} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Summary + filter/sort */}
            {allTokens && (
                <WalletHeader
                    tokens={allTokens}
                    filter={filter}
                    onFilter={setFilter}
                    sort={sort}
                    onSort={setSort}
                    displayCount={displayTokens.length}
                />
            )}

            {/* Loading / error */}
            {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={14} sx={{ color: 'primary.main' }} />
                    <Typography variant="body2">{t('common.loading')}</Typography>
                </Box>
            )}
            {error && (
                <Typography variant="body2" sx={{ color: 'error.main' }}>{error}</Typography>
            )}

            {/* Token grid */}
            {displayTokens.length > 0 && (
                <Grid container spacing={1.5}>
                    {displayTokens.map((ticker) => (
                        <Grid xs={6} sm={4} md={3} key={ticker}>
                            <TokenCard ticker={ticker} address={address} />
                        </Grid>
                    ))}
                </Grid>
            )}
            {displayTokens.length === 0 && !loading && allTokens && allTokens.length > 0 && (
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                    No tokens match the current filter.
                </Typography>
            )}
            {allTokens?.length === 0 && !loading && (
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                    No tokens found for this address.
                </Typography>
            )}

            {/* Mint history modal */}
            <Dialog
                open={historyOpen}
                onClose={() => setHistoryOpen(false)}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            backgroundColor: 'background.paper',
                            border: '0.5px solid #2e2845',
                            backgroundImage: 'none',
                        }
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: '0.5px solid #2e2845', pb: 1.5,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h3">Mint history</Typography>
                        <Chip label={mintCount} size="small" sx={{
                            height: 18, fontSize: '0.65rem',
                            backgroundColor: 'rgba(168,85,247,0.12)',
                            color: 'primary.light',
                        }} />
                    </Box>
                    <IconButton size="small" onClick={() => setHistoryOpen(false)} sx={{ color: 'text.disabled' }}>
                        <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, maxHeight: '60vh', overflowY: 'auto' }}>
                    <MintHistory address={address} />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default WalletSection;