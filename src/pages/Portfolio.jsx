import { useState } from 'react';
import {
    Box, Typography, TextField, Grid, Paper,
    Chip, CircularProgress, InputAdornment
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { useTracApi } from '../hooks/useTracApi';
import api, { formatBalance } from '../api/tracApi';

const DEFAULT_WALLETS = {
    'TAP Wallet': 'bc1psvmxkmhvv3jkg0w6gz4vtvwk77td7mwlytu39g2pck76xxd0e6fsmfpu4k',
    'Unisat Wallet': 'bc1pxzkefk768gfa8fga96secpxeuk2f9mql5n55uspmgr5xg6lzkttslhh4s8',
};
const PINNED_TOKENS = {
    'bc1psvmxkmhvv3jkg0w6gz4vtvwk77td7mwlytu39g2pck76xxd0e6fsmfpu4k': ['tnk'],
};

const TokenCard = ({ ticker, address }) => {
    const { data: deployment } = useTracApi(() => api.getDeployment(ticker), [ticker]);
    const { data: balance, loading } = useTracApi(
        () => api.getBalance(address, ticker), [address, ticker]
    );
    const { data: holdersLen } = useTracApi(
        () => api.getHoldersLength(ticker), [ticker]
    );

    const dec = deployment?.dec ?? 0;
    const isDmt = deployment?.dmt === true;
    const formatted = balance !== null ? formatBalance(balance, dec) : null;

    return (
        <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography
                    variant="caption"
                    sx={{
                        fontFamily: 'monospace',
                        color: 'primary.light',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                    }}
                >
                    {ticker}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {isDmt && (
                        <Chip label="DMT" size="small" sx={{
                            height: 16, fontSize: '0.6rem',
                            backgroundColor: 'rgba(168,85,247,0.15)',
                            color: 'primary.light',
                        }} />
                    )}
                    {dec === 0 && !isDmt && (
                        <Chip label="fungible" size="small" sx={{
                            height: 16, fontSize: '0.6rem',
                            backgroundColor: 'rgba(249,115,22,0.15)',
                            color: 'secondary.main',
                        }} />
                    )}
                </Box>
            </Box>

            <Box sx={{ my: 1.5 }}>
                {loading ? (
                    <CircularProgress size={16} sx={{ color: 'primary.main' }} />
                ) : formatted !== null ? (
                    <Typography variant="h4" sx={{ color: 'text.primary', wordBreak: 'break-all' }}>
                        {formatted}
                    </Typography>
                ) : (
                    <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                        not synced
                    </Typography>
                )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption">
                    {holdersLen !== null ? `${Number(holdersLen).toLocaleString()} holders` : '—'}
                </Typography>
                {deployment?.dt && (
                    <Typography variant="caption">
                        {holdersLen !== null ? `${Number(holdersLen).toLocaleString()} holders` : '—'}
                        {deployment?.dt ? ` · ${deployment.dt === 'n' ? 'nonce' : deployment.dt === 'h' ? 'block height' : deployment.dt === 'b' ? 'bits' : deployment.dt}` : ''}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

const WalletSection = ({ label, address }) => {
    const { t } = useTranslation();
    const { data: tokens, loading, error } = useTracApi(
        () => api.getAccountTokens(address), [address]
    );
    const pinned = PINNED_TOKENS[address] || [];
    const allTokens = tokens ? [...new Set([...pinned, ...tokens])] : pinned;

    return (
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <AccountBalanceWalletIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                <Typography variant="h4">{label}</Typography>
            </Box>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', mb: 2, display: 'block' }}>
                {address}
            </Typography>

            {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={14} sx={{ color: 'primary.main' }} />
                    <Typography variant="body2">{t('common.loading')}</Typography>
                </Box>
            )}
            {error && (
                <Typography variant="body2" sx={{ color: 'error.main' }}>{error}</Typography>
            )}
            {allTokens && (
                <Grid container spacing={1.5}>
                    {allTokens.map((ticker) => (
                        <Grid item xs={6} sm={4} md={3} key={ticker}>
                            <TokenCard ticker={ticker} address={address} />
                        </Grid>
                    ))}
                </Grid>
            )}
            {allTokens?.length === 0 && (
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                    No tokens found for this address.
                </Typography>
            )}
        </Box>
    );
};

const Portfolio = () => {
    const { t } = useTranslation();
    const [searchAddress, setSearchAddress] = useState('');
    const [searchedAddress, setSearchedAddress] = useState(null);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchAddress.trim()) {
            setSearchedAddress(searchAddress.trim());
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <AccountBalanceWalletIcon sx={{ color: 'secondary.main' }} />
                <Typography variant="h2">{t('nav.myPortfolio')}</Typography>
            </Box>

            <TextField
                placeholder={t('common.search')}
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyDown={handleSearch}
                size="small"
                sx={{
                    mb: 4,
                    width: 480,
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'background.paper',
                        '& fieldset': { borderColor: '#2e2845' },
                        '&:hover fieldset': { borderColor: 'primary.dark' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                    },
                    '& input': { color: 'text.primary', fontSize: '0.8125rem' },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                        </InputAdornment>
                    ),
                }}
            />

            {searchedAddress ? (
                <WalletSection label="Search result" address={searchedAddress} />
            ) : (
                Object.entries(DEFAULT_WALLETS).map(([label, address]) => (
                    <WalletSection key={address} label={label} address={address} />
                ))
            )}
        </Box>
    );
};

export default Portfolio;