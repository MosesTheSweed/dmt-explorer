import { useState } from 'react';
import { Box, Typography, Grid, CircularProgress, Tooltip, IconButton } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTranslation } from 'react-i18next';
import { useTracApi } from '../../hooks/useTracApi';
import api from '../../api/tracApi';
import TokenCard from '../../components/tokens/TokenCard';
import WalletHeader from './WalletHeader.jsx';
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
    const { t } = useTranslation();

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <AccountBalanceWalletIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                <Typography variant="h4">{label}</Typography>
            </Box>
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

            {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={14} sx={{ color: 'primary.main' }} />
                    <Typography variant="body2">{t('common.loading')}</Typography>
                </Box>
            )}
            {error && (
                <Typography variant="body2" sx={{ color: 'error.main' }}>{error}</Typography>
            )}
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
        </Box>
    );
};

export default WalletSection;