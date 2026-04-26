import { useState } from 'react';
import { Box, Typography, Grid, CircularProgress, Tooltip, IconButton } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTranslation } from 'react-i18next';
import { useTracApi } from '../../hooks/useTracApi';
import api from '../../api/tracApi';
import TokenCard from '../../components/tokens/TokenCard';
import WalletSummary from './WalletSummary';
import { PINNED_TOKENS } from './constants';

const WalletSection = ({ label, address, pinned = [] }) => {
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation();
    const { data: tokens, loading, error } = useTracApi(
        () => api.getAccountTokens(address), [address]
    );

    const resolvedPinned = pinned.length > 0 ? pinned : (PINNED_TOKENS[address] ?? []);
    const allTokens = tokens
        ? [...new Set([...resolvedPinned, ...tokens])]
        : resolvedPinned.length > 0 ? resolvedPinned : null;

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

            {allTokens && <WalletSummary tokens={allTokens} />}

            {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={14} sx={{ color: 'primary.main' }} />
                    <Typography variant="body2">{t('common.loading')}</Typography>
                </Box>
            )}
            {error && (
                <Typography variant="body2" sx={{ color: 'error.main' }}>{error}</Typography>
            )}
            {allTokens && allTokens.length > 0 && (
                <Grid container spacing={1.5}>
                    {allTokens.map((ticker) => (
                        <Grid xs={6} sm={4} md={3} key={ticker}>
                            <TokenCard ticker={ticker} address={address} />
                        </Grid>
                    ))}
                </Grid>
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