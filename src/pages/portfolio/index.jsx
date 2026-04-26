import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import WalletSection from './WalletSection';
import { DEFAULT_WALLETS, PINNED_TOKENS } from './constants';

const Portfolio = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const addressParam = searchParams.get('address');
    const [searchAddress, setSearchAddress] = useState('');
    const [searchedAddress, setSearchedAddress] = useState(null);

    const activeAddress = searchedAddress || addressParam;
    const isOwnWallet = Object.values(DEFAULT_WALLETS).includes(activeAddress);
    const pageTitle = !activeAddress || isOwnWallet ? t('nav.myPortfolio') : 'Address lookup';

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchAddress.trim()) {
            setSearchedAddress(searchAddress.trim());
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <AccountBalanceWalletIcon sx={{ color: 'secondary.main' }} />
                <Typography variant="h2">{pageTitle}</Typography>
                {activeAddress && !isOwnWallet && (
                    <Box
                        onClick={() => { setSearchedAddress(null); setSearchAddress(''); setSearchParams({}); }}
                        sx={{
                            display: 'flex', alignItems: 'center', gap: 0.5,
                            cursor: 'pointer', mb: 2,
                            color: 'text.disabled',
                            '&:hover': { color: 'primary.light' },
                            fontSize: '0.8rem',
                        }}
                    >
                        <Typography variant="caption" sx={{ mt: 2, color: 'secondary.light'}}>← back to my portfolio</Typography>
                    </Box>
                )}
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

            {activeAddress ? (
                <WalletSection
                    key={activeAddress}
                    label="Address"
                    address={activeAddress}
                    pinned={[]}
                />
            ) : (
                Object.entries(DEFAULT_WALLETS).map(([label, address]) => (
                    <WalletSection
                        key={address}
                        label={label}
                        address={address}
                        pinned={PINNED_TOKENS[address] ?? []}
                    />
                ))
            )}
        </Box>
    );
};

export default Portfolio;