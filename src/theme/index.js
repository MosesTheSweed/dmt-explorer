import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#16131f',
            paper: '#1c1828',
        },
        primary: {
            main: '#a855f7',
            light: '#c084fc',
            dark: '#7e22ce',
        },
        secondary: {
            main: '#f97316',
            light: '#fb923c',
            dark: '#c2410c',
        },
        text: {
            primary: '#e8d5ff',
            secondary: '#b8a8cc',
            disabled: '#6b5f8a',
        },
        divider: '#2e2845',
        success: {
            main: '#22c55e',
            light: '#4ade80',
            dark: '#16a34a',
        },
        border: {
            subtle: '#2e2845',
            medium: 'rgba(168,85,247,0.3)',
        },
        error: { main: '#f87171' },
        warning: { main: '#f97316' },
        info: { main: '#c084fc' },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontSize: '1.75rem', fontWeight: 500, color: '#e8d5ff' },
        h2: { fontSize: '1.375rem', fontWeight: 500, color: '#e8d5ff' },
        h3: { fontSize: '1.125rem', fontWeight: 500, color: '#e8d5ff' },
        h4: { fontSize: '1rem', fontWeight: 500, color: '#e8d5ff' },
        body1: { fontSize: '0.875rem', color: '#9b8ab4' },
        body2: { fontSize: '0.8125rem', color: '#9b8ab4' },
        caption: { fontSize: '0.75rem', color: '#6b5f8a', letterSpacing: '0.06em' },
        overline: {
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#6b5f8a',
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                ':root': {
                    '--tint-purple-xs': 'rgba(168,85,247,0.05)',
                    '--tint-purple-sm': 'rgba(168,85,247,0.08)',
                    '--tint-purple-md': 'rgba(168,85,247,0.12)',
                    '--tint-purple-lg': 'rgba(168,85,247,0.15)',
                    '--tint-purple-xl': 'rgba(168,85,247,0.22)',
                    '--tint-orange-xs': 'rgba(249,115,22,0.04)',
                    '--tint-orange-sm': 'rgba(249,115,22,0.05)',
                    '--tint-orange-md': 'rgba(249,115,22,0.12)',
                    '--tint-orange-lg': 'rgba(249,115,22,0.15)',
                    '--tint-green-xs': 'rgba(34,197,94,0.05)',
                    '--tint-green-md': 'rgba(34,197,94,0.12)',
                    '--border-subtle': '#2e2845',
                },
                body: {
                    backgroundColor: '#16131f',
                    scrollbarColor: '#2e2845 #16131f',
                    '&::-webkit-scrollbar': { width: '6px' },
                    '&::-webkit-scrollbar-track': { background: '#16131f' },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#2e2845',
                        borderRadius: '3px',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: '0.5px solid #2e2845',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#1c1828',
                    border: 'none',
                    borderRight: '0.5px solid #2e2845',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: '0 8px 8px 0',
                    marginRight: '8px',
                    '&.Mui-selected': {
                        backgroundColor: 'var(--tint-purple-sm)',
                        borderLeft: '2px solid primary.main',
                        '&:hover': { backgroundColor: 'var(--tint-purple-md)' },
                    },
                    '&:hover': { backgroundColor: 'var(--tint-purple-xs)' },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontSize: '0.6875rem',
                    height: '20px',
                    fontWeight: 500,
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: { borderColor: '#2e2845' },
            },
        },
    },
});

export default theme;