import './bootstrap';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0d9488',
            light: '#14b8a6',
            dark: '#0f766e',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#0f172a',
            light: '#1e293b',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#0f172a',
            secondary: '#64748b',
        },
        error:   { main: '#ef4444' },
        warning: { main: '#f59e0b' },
        success: { main: '#10b981' },
        info:    { main: '#3b82f6' },
    },
    typography: {
        fontFamily: "'DM Sans', sans-serif",
        h1: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
        h2: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
        h3: { fontFamily: "'Playfair Display', serif", fontWeight: 500 },
        h4: { fontFamily: "'Playfair Display', serif", fontWeight: 500 },
        button: { textTransform: 'none', fontWeight: 500 },
    },
    shape: { borderRadius: 10 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 10, padding: '8px 20px' },
                containedPrimary: {
                    background: '#0d9488',
                    '&:hover': { background: '#0f766e' },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    boxShadow: 'none',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: { borderRadius: 12 },
            },
        },
        MuiTextField: {
            defaultProps: { variant: 'outlined', size: 'small' },
        },
        MuiChip: {
            styleOverrides: {
                root: { borderRadius: 6, fontWeight: 500 },
            },
        },
    },
});

createInertiaApp({
    title: (title) => `${title} — DentApp`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx')
        ),
    setup({ el, App, props }) {
        createRoot(el).render(
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#0d9488',
        showSpinner: true,
    },
});