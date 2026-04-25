import { Box } from '@mui/material';
import { useState } from 'react';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';

export default function AppShell({ children, activePage, onNavigate }) {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Sidebar activePage={activePage} onNavigate={onNavigate} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: `${DRAWER_WIDTH}px`,
                    p: 3,
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                }}
            >
                {children}
            </Box>
        </Box>
    );
}