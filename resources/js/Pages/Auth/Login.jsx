import { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import {
    Box, TextField, Button, Typography, Alert, 
    InputAdornment, IconButton, CircularProgress,
} from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded';

// const ROLES = [
//     { label: 'Admin',        email: 'admin@dentapp.com' },
//     { label: 'Dentist',      email: 'dentist@dentapp.com' },
//     { label: 'Receptionist', email: 'reception@dentapp.com' },
// ];

export default function Login({ status }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email:    '',
        password: '',
        remember: false,
    });

    // const handleRoleSelect = (_, newEmail) => {
    //     if (!newEmail) return;
    //     setData('email', newEmail);
    // };

    const submit = (e) => {
        e.preventDefault();
        post('/login', { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title="Login" />
            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>

                {/* ── Left Panel ── */}
                <Box sx={{
                    width: { xs: 0, md: '42%' },
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 4,
                    background: 'linear-gradient(160deg, #0f766e 0%, #0d9488 45%, #0891b2 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Decorative circles */}
                    <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)', top: -80, left: -80 }} />
                    <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)', bottom: -60, right: -60 }} />

                    {/* Brand */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, zIndex: 1 }}>
                        <Box sx={{
                            width: 42, height: 42, borderRadius: 2.5,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <MedicalServicesRoundedIcon sx={{ color: 'white', fontSize: 22 }} />
                        </Box>
                        <Typography sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.3rem', fontWeight: 600, color: 'white',
                        }}>
                            DentApp
                        </Typography>
                    </Box>

                    {/* Tagline */}
                    <Box sx={{ zIndex: 1 }}>
                        <Typography sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '2rem', fontWeight: 600,
                            color: 'white', lineHeight: 1.25, mb: 1.5,
                        }}>
                            Your clinic,<br />seamlessly managed.
                        </Typography>
                        <Typography sx={{
                            color: 'rgba(255,255,255,0.75)',
                            fontSize: '0.875rem', lineHeight: 1.75, fontWeight: 300,
                        }}>
                            Appointments, patient records, and billing — all in one beautiful,
                            secure platform built for dental professionals.
                        </Typography>

                        {/* Decorative teeth */}
                        <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                            {[1,0,1,0,1,0,1].map((h, i) => (
                                <Box key={i} sx={{
                                    width: 28, height: 36,
                                    bgcolor: h ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)',
                                    borderRadius: '4px 4px 8px 8px',
                                    border: '1px solid rgba(255,255,255,0.25)',
                                }} />
                            ))}
                        </Box>
                    </Box>

                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', zIndex: 1 }}>
                        © 2026 DentApp · All rights reserved
                    </Typography>
                </Box>

                {/* ── Right Panel ── */}
                <Box sx={{
                    flex: 1, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', p: { xs: 2, sm: 4 },
                }}>
                    <Box sx={{ width: '100%', maxWidth: 420 }}>
                        <Typography sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.85rem', fontWeight: 600,
                            color: '#0f172a', mb: 0.5,
                        }}>
                            Welcome back
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 3 }}>
                            Sign in to your dashboard
                        </Typography>

                        {status && (
                            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                                {status}
                            </Alert>
                        )}

                        {errors.email && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                                {errors.email}
                            </Alert>
                        )}

                        {/* Role Selector */}
                        {/* <Box sx={{ mb: 2.5 }}>
                            <Typography sx={{
                                fontSize: '0.75rem', fontWeight: 500,
                                color: '#64748b', mb: 0.75,
                                textTransform: 'uppercase', letterSpacing: '0.05em',
                            }}>
                                Sign in as
                            </Typography>
                            <ToggleButtonGroup
                                value={data.email}
                                exclusive
                                onChange={handleRoleSelect}
                                fullWidth
                                size="small"
                                sx={{
                                    gap: 1,
                                    '& .MuiToggleButton-root': {
                                        border: '1.5px solid #e2e8f0 !important',
                                        borderRadius: '8px !important',
                                        fontSize: '0.78rem',
                                        fontWeight: 500,
                                        color: '#64748b',
                                        py: 0.6,
                                        '&.Mui-selected': {
                                            bgcolor: '#ccfbf1 !important',
                                            color: '#0f766e !important',
                                            borderColor: '#0d9488 !important',
                                        },
                                    },
                                }}
                            >
                                {ROLES.map(r => (
                                    <ToggleButton key={r.email} value={r.email}>
                                        {r.label}
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                        </Box> */}

                        <form onSubmit={submit}>
                            {/* Email */}
                            <Box sx={{ mb: 2 }}>
                                <Typography sx={{
                                    fontSize: '0.75rem', fontWeight: 500,
                                    color: '#64748b', mb: 0.5,
                                    textTransform: 'uppercase', letterSpacing: '0.05em',
                                }}>
                                    Email address
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    error={!!errors.email}
                                    placeholder="you@dentapp.com"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailRoundedIcon sx={{ fontSize: 17, color: '#94a3b8' }} />
                                            </InputAdornment>
                                        ),
                                        sx: { borderRadius: 2.5, fontSize: '0.875rem' },
                                    }}
                                />
                            </Box>

                            {/* Password */}
                            <Box sx={{ mb: 3 }}>
                                <Typography sx={{
                                    fontSize: '0.75rem', fontWeight: 500,
                                    color: '#64748b', mb: 0.5,
                                    textTransform: 'uppercase', letterSpacing: '0.05em',
                                }}>
                                    Password
                                </Typography>
                                <TextField
                                    fullWidth
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    error={!!errors.password}
                                    placeholder="••••••••"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockRoundedIcon sx={{ fontSize: 17, color: '#94a3b8' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                                                    {showPassword
                                                        ? <VisibilityOffRoundedIcon sx={{ fontSize: 17 }} />
                                                        : <VisibilityRoundedIcon sx={{ fontSize: 17 }} />
                                                    }
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        sx: { borderRadius: 2.5, fontSize: '0.875rem' },
                                    }}
                                />
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={processing}
                                sx={{ py: 1.1, fontSize: '0.9rem', borderRadius: 2.5 }}
                            >
                                {processing
                                    ? <CircularProgress size={20} color="inherit" />
                                    : 'Sign in to Dashboard'
                                }
                            </Button>
                        </form>
                    </Box>
                </Box>
            </Box>
        </>
    );
}