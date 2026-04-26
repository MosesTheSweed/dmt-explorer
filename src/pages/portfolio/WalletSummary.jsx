import { Box, Typography, Divider } from '@mui/material';

const WalletSummary = ({ tokens }) => {
    const dmtCount = tokens?.filter((t) => t.startsWith('dmt-')).length ?? 0;
    const fungibleCount = (tokens?.length ?? 0) - dmtCount;

    return (
        <Box sx={{
            display: 'flex',
            gap: 2,
            mb: 2,
            p: 1.5,
            backgroundColor: 'rgba(168,85,247,0.05)',
            border: '0.5px solid #2e2845',
            borderRadius: 2,
            flexWrap: 'wrap',
        }}>
            <Box>
                <Typography variant="overline" sx={{ display: 'block', lineHeight: 1.2 }}>
                    Total tokens
                </Typography>
                <Typography variant="h4" sx={{ color: 'text.primary' }}>
                    {tokens?.length ?? 0}
                </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: '#2e2845' }} />
            <Box>
                <Typography variant="overline" sx={{ display: 'block', lineHeight: 1.2 }}>
                    DMT
                </Typography>
                <Typography variant="h4" sx={{ color: 'primary.light' }}>
                    {dmtCount}
                </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: '#2e2845' }} />
            <Box>
                <Typography variant="overline" sx={{ display: 'block', lineHeight: 1.2 }}>
                    Fungible
                </Typography>
                <Typography variant="h4" sx={{ color: 'secondary.main' }}>
                    {fungibleCount}
                </Typography>
            </Box>
        </Box>
    );
};

export default WalletSummary;