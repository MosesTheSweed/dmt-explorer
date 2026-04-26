import { Box, Typography, Divider, ToggleButton, ToggleButtonGroup } from '@mui/material';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';

const SORT_OPTIONS = [
    { value: 'name', label: 'A–Z' },
    { value: 'name-desc', label: 'Z–A' },
    { value: 'dmt-first', label: 'DMT first' },
];

const FILTER_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'dmt', label: 'DMT' },
    { value: 'fungible', label: 'Fungible' },
];

const toggleSx = {
    py: 0.25, px: 1, fontSize: '0.7rem',
    color: 'text.secondary', borderColor: '#2e2845',
    '&.Mui-selected': {
        backgroundColor: 'rgba(168,85,247,0.15)',
        color: 'primary.light',
        borderColor: '#a855f7',
    },
};

const WalletHeader = ({ tokens, filter, onFilter, sort, onSort, displayCount }) => {
    const dmtCount = tokens?.filter((t) => t.startsWith('dmt-')).length ?? 0;
    const fungibleCount = (tokens?.length ?? 0) - dmtCount;

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2, p: 1.5,
            backgroundColor: 'rgba(168,85,247,0.05)',
            border: '0.5px solid #2e2845',
            borderRadius: 2,
            flexWrap: 'wrap',
            gap: 2,
        }}>
            {/* Stats — left */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                {displayCount !== undefined && displayCount < (tokens?.length ?? 0) && (
                    <>
                        <Divider orientation="vertical" flexItem sx={{ borderColor: '#2e2845' }} />
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                            {displayCount} shown
                        </Typography>
                    </>
                )}
            </Box>

            {/* Controls — right */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <ToggleButtonGroup
                    value={filter}
                    exclusive
                    onChange={(_, val) => val && onFilter(val)}
                    size="small"
                >
                    {FILTER_OPTIONS.map(opt => (
                        <ToggleButton key={opt.value} value={opt.value} sx={toggleSx}>
                            {opt.label}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <SortByAlphaIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                    <ToggleButtonGroup
                        value={sort}
                        exclusive
                        onChange={(_, val) => val && onSort(val)}
                        size="small"
                    >
                        {SORT_OPTIONS.map(opt => (
                            <ToggleButton key={opt.value} value={opt.value} sx={toggleSx}>
                                {opt.label}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>
            </Box>
        </Box>
    );
};

export default WalletHeader;