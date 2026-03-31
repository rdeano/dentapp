import { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Box, Drawer, List, ListItemButton, ListItemIcon,
    ListItemText, Typography, Avatar, Tooltip, Divider,
    IconButton, Menu, MenuItem, Snackbar, Alert,
    useTheme, useMediaQuery, Badge,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';
import MedicalInformationRoundedIcon from '@mui/icons-material/MedicalInformationRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

const MINI = 68;
const FULL = 240;

const ROLE_COLORS = {
    Admin:        '#0d9488',
    Dentist:      '#3b82f6',
    Receptionist: '#f59e0b',
};

export default function AppLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const isAdmin = user?.role === 'Admin';
    const current = window.location.pathname;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [expanded, setExpanded]     = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl]     = useState(null);
    const [snackbar, setSnackbar]     = useState({ open: false, message: '', severity: 'success' });

    const roleColor = ROLE_COLORS[user?.role] ?? '#0d9488';

    const today = new Date().toLocaleDateString('en-PH', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });

    // Close mobile drawer on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [current]);

    useEffect(() => {
        if (flash?.success) {
            setSnackbar({ open: true, message: flash.success, severity: 'success' });
        } else if (flash?.error) {
            setSnackbar({ open: true, message: flash.error, severity: 'error' });
        } else if (flash?.warning) {
            setSnackbar({ open: true, message: flash.warning, severity: 'warning' });
        }
    }, [flash]);

    const handleLogout = () => {
        setAnchorEl(null);
        router.post('/logout');
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleMenuToggle = () => {
        if (isMobile) {
            setMobileOpen(prev => !prev);
        } else {
            setExpanded(prev => !prev);
        }
    };

    const NAV_SECTIONS = [
        {
            label: 'Main',
            items: [
                { label: 'Dashboard',    icon: <DashboardRoundedIcon />,          href: '/dashboard' },
                { label: 'Appointments', icon: <CalendarMonthRoundedIcon />,       href: '/appointments' },
                { label: 'Calendar',     icon: <CalendarMonthRoundedIcon />,       href: '/appointments/calendar' },
                { label: 'Patients',     icon: <PeopleRoundedIcon />,              href: '/patients' },
                { label: 'Treatments',   icon: <MedicalInformationRoundedIcon />,  href: '/treatments', adminOnly: true },
            ],
        },
        {
            label: 'Finance',
            items: [
                { label: 'Payments', icon: <ReceiptRoundedIcon />, href: '/payments' },
            ],
        },
        {
            label: 'Management',
            items: [
                { label: 'Dentists',  icon: <LocalHospitalRoundedIcon />, href: '/dentists', adminOnly: true },
                { label: 'Reports',   icon: <BarChartRoundedIcon />,      href: '/reports',  adminOnly: true },
                { label: 'Settings',  icon: <SettingsRoundedIcon />,      href: '/profile' },
            ],
        },
    ];

    const drawerContent = (
        <>
            {/* Brand */}
            <Box sx={{
                height: 66, display: 'flex', alignItems: 'center',
                px: 1.8, gap: 1.5,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
                <IconButton
                    onClick={handleMenuToggle}
                    sx={{ color: 'rgba(255,255,255,0.6)', p: 0.5, '&:hover': { color: 'white' } }}
                >
                    <MenuRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>
                {(expanded || isMobile) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Box sx={{
                            width: 30, height: 30, borderRadius: 1.5,
                            background: 'linear-gradient(135deg, #0d9488, #0891b2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <MedicalServicesRoundedIcon sx={{ color: 'white', fontSize: 16 }} />
                        </Box>
                        <Box>
                            <Typography sx={{
                                fontFamily: "'Playfair Display', serif",
                                color: 'white', fontWeight: 600,
                                fontSize: '0.95rem', whiteSpace: 'nowrap', lineHeight: 1.2,
                            }}>
                                DentApp
                            </Typography>
                            <Typography sx={{
                                fontSize: '0.58rem', color: 'rgba(255,255,255,0.35)',
                                whiteSpace: 'nowrap', letterSpacing: '0.08em', textTransform: 'uppercase',
                            }}>
                                Clinic Management
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Nav Sections */}
            <Box sx={{
                flex: 1, overflowY: 'auto', overflowX: 'hidden', pt: 1.5, pb: 1,
                '&::-webkit-scrollbar': { display: 'none' },
            }}>
                {NAV_SECTIONS.map((section) => (
                    <Box key={section.label} sx={{ mb: 1 }}>
                        {(expanded || isMobile) && (
                            <Typography sx={{
                                fontSize: '0.6rem', fontWeight: 700,
                                color: 'rgba(255,255,255,0.25)',
                                letterSpacing: '0.12em', textTransform: 'uppercase',
                                px: 2.5, py: 0.75,
                            }}>
                                {section.label}
                            </Typography>
                        )}
                        {!(expanded || isMobile) && <Box sx={{ height: 8 }} />}
                        <List disablePadding sx={{ px: 1 }}>
                            {section.items
                                .filter(item => !item.adminOnly || isAdmin)
                                .map((item) => {
                                    const active = current === item.href || current.startsWith(item.href + '/');
                                    return (
                                        <Tooltip
                                            key={item.href}
                                            title={(!expanded && !isMobile) ? item.label : ''}
                                            placement="right"
                                            arrow
                                        >
                                            <ListItemButton
                                                component={Link}
                                                href={item.href}
                                                sx={{
                                                    borderRadius: 2, mb: 0.4,
                                                    px: 1.5, py: 0.9, minHeight: 42,
                                                    position: 'relative',
                                                    bgcolor: active ? 'rgba(13,148,136,0.15)' : 'transparent',
                                                    '&:hover': {
                                                        bgcolor: active ? 'rgba(13,148,136,0.2)' : 'rgba(255,255,255,0.05)',
                                                    },
                                                    '&::before': active ? {
                                                        content: '""',
                                                        position: 'absolute',
                                                        left: 0, top: '20%',
                                                        height: '60%', width: 3,
                                                        bgcolor: '#0d9488',
                                                        borderRadius: '0 2px 2px 0',
                                                    } : {},
                                                }}
                                            >
                                                <ListItemIcon sx={{
                                                    minWidth: 34,
                                                    color: active ? '#0d9488' : 'rgba(255,255,255,0.4)',
                                                    '& svg': { fontSize: 19 },
                                                }}>
                                                    {item.icon}
                                                </ListItemIcon>
                                                {(expanded || isMobile) && (
                                                    <ListItemText
                                                        primary={item.label}
                                                        primaryTypographyProps={{
                                                            fontSize: '0.83rem',
                                                            fontWeight: active ? 600 : 400,
                                                            color: active ? 'white' : 'rgba(255,255,255,0.55)',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    />
                                                )}
                                            </ListItemButton>
                                        </Tooltip>
                                    );
                                })}
                        </List>
                    </Box>
                ))}
            </Box>

            {/* Bottom User Section */}
            <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', p: 1.2 }}>
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1.2,
                    px: 1, py: 0.8, borderRadius: 2,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                }}>
                    <Avatar sx={{
                        width: 34, height: 34, bgcolor: roleColor,
                        fontSize: '0.72rem', fontWeight: 700, flexShrink: 0,
                        boxShadow: '0 0 0 2px rgba(255,255,255,0.1)',
                    }}>
                        {user?.initials}
                    </Avatar>
                    {(expanded || isMobile) && (
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{
                                fontSize: '0.78rem', fontWeight: 600, color: 'white',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                                {user?.name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: roleColor, fontWeight: 500 }}>
                                {user?.role}
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Tooltip title={(!expanded && !isMobile) ? 'Logout' : ''} placement="right" arrow>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 2, px: 1.5, py: 0.8, mt: 0.5,
                            '&:hover': { bgcolor: 'rgba(239,68,68,0.12)' },
                        }}
                    >
                        <ListItemIcon sx={{
                            minWidth: 34, color: 'rgba(239,68,68,0.6)',
                            '& svg': { fontSize: 18 },
                        }}>
                            <LogoutRoundedIcon />
                        </ListItemIcon>
                        {(expanded || isMobile) && (
                            <ListItemText
                                primary="Log out"
                                primaryTypographyProps={{
                                    fontSize: '0.82rem', color: 'rgba(239,68,68,0.7)', whiteSpace: 'nowrap',
                                }}
                            />
                        )}
                    </ListItemButton>
                </Tooltip>
            </Box>
        </>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f1f5f9' }}>

            {/* ── Desktop Sidebar (permanent) ── */}
            {!isMobile && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: expanded ? FULL : MINI,
                        flexShrink: 0,
                        transition: 'width .22s cubic-bezier(.4,0,.2,1)',
                        '& .MuiDrawer-paper': {
                            width: expanded ? FULL : MINI,
                            transition: 'width .22s cubic-bezier(.4,0,.2,1)',
                            overflowX: 'hidden',
                            bgcolor: '#0f172a',
                            border: 'none',
                            borderRadius: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}

            {/* ── Mobile Sidebar (temporary) ── */}
            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: FULL,
                            bgcolor: '#0f172a',
                            border: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}

            {/* ── Main Area ── */}
            <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Topbar */}
                <Box sx={{
                    height: 66, bgcolor: 'white',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3, flexShrink: 0,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                    {/* Left */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {/* Mobile hamburger in topbar */}
                        {isMobile && (
                            <IconButton
                                onClick={() => setMobileOpen(true)}
                                sx={{ color: '#64748b' }}
                            >
                                <MenuRoundedIcon />
                            </IconButton>
                        )}
                        <Box>
                            <Typography sx={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.2,
                            }}>
                                {title}
                            </Typography>
                            <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', mt: 0.2 }}>
                                {today}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Right */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            sx={{
                                display: 'flex', alignItems: 'center',
                                gap: 1, px: 1.2, py: 0.6,
                                border: '1px solid #e2e8f0',
                                borderRadius: 2.5, cursor: 'pointer',
                                '&:hover': { bgcolor: '#f8fafc' },
                                transition: 'all .15s',
                            }}
                        >
                            <Avatar sx={{
                                width: 26, height: 26, bgcolor: roleColor,
                                fontSize: '0.65rem', fontWeight: 700,
                            }}>
                                {user?.initials}
                            </Avatar>
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>
                                    {user?.name}
                                </Typography>
                                <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                                    {user?.role}
                                </Typography>
                            </Box>
                            <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                        </Box>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                            PaperProps={{
                                sx: {
                                    mt: 1, borderRadius: 2,
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                    minWidth: 160,
                                },
                            }}
                        >
                            <MenuItem
                                component={Link}
                                href="/profile"
                                onClick={() => setAnchorEl(null)}
                                sx={{ fontSize: '0.83rem', gap: 1.2 }}
                            >
                                <SettingsRoundedIcon fontSize="small" sx={{ color: '#64748b' }} />
                                Profile & Settings
                            </MenuItem>
                            <Divider />
                            <MenuItem
                                onClick={handleLogout}
                                sx={{ fontSize: '0.83rem', color: '#ef4444', gap: 1.2 }}
                            >
                                <LogoutRoundedIcon fontSize="small" /> Log out
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>

                {/* Page Content */}
                <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 } }}>
                    {children}
                </Box>
            </Box>

            {/* Flash Messages */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ borderRadius: 2.5, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}