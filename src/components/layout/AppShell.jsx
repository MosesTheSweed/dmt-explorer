import { Box } from '@mui/material';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';

const AppShell = ({ children }) => (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Sidebar />
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

export default AppShell;