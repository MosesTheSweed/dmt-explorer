import { Box, Typography, Paper, Chip, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTracApi } from '../../hooks/useTracApi';
import api, { formatBalance } from '../../api/tracApi';

const TokenCard = ({ ticker, address }) => {
    const navigate = useNavigate();
    const { data: deployment } = useTracApi(() => api.getDeployment(ticker), [ticker]);
    const { data: balance, loading } = useTracApi(
        () => api.getBalance(address, ticker), [address, ticker]
    );
    const { data: holdersLen } = useTracApi(
        () => api.getHoldersLength(ticker), [ticker]
    );

    const dec = deployment?.dec ?? 0;
    const isDmt = deployment?.dmt === true;
    const formatted = (balance !== null && balance !== undefined)
        ? formatBalance(String(balance), dec)
        : null;

    const fieldLabel = deployment?.dt
        ? ({ n: 'nonce', h: 'block height', b: 'bits' }[deployment.dt] ?? deployment.dt)
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
                    borderColor: '#a855f7',
                    backgroundColor: 'rgba(168,85,247,0.05)',
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography sx={{
                    fontFamily: 'monospace',
                    color: 'primary.light',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                }}>
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
                    { !isDmt && (
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
                    {holdersLen != null ? `${Number(holdersLen).toLocaleString()} holders` : '—'}
                    {fieldLabel ? ` · ${fieldLabel}` : ''}
                </Typography>
            </Box>
        </Paper>
    );
};

export default TokenCard;