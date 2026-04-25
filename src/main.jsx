import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import App from './App';
import theme from './theme';
import enTranslation from './locales/en/translation.json';

i18n
    .use(initReactI18next)
    .init({
        resources: { en: { translation: enTranslation } },
        lng: 'en',
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
    });

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>
);