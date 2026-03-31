import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Box, Button, TextField, Typography, MenuItem,
    Grid, Divider, CircularProgress,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

const SPECIALIZATIONS = [
    'General Dentistry',
    'Orthodontics',
    'Oral Surgery',
    'Periodontics',
    'Endodontics',
    'Prosthodontics',
    'Pediatric Dentistry',
    'Cosmetic Dentistry',
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name:           '',
        email:          '',
        password:       '',
        phone:          '',
        specialization: '',
        is_active:      true,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/dentists');
    };

    return (
        <AppLayout title="Add Dentist">
            <Head title="Add Dentist" />

            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Button
                    component={Link}
                    href="/dentists"
                    startIcon={<ArrowBackRoundedIcon />}
                    sx={{ color: '#64748b', borderRadius: 2 }}
                >
                    Back
                </Button>
                <Box>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>
                        Add Dentist
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Add a new dentist to your clinic
                    </Typography>
                </Box>
            </Box>

            <form onSubmit={submit}>

                {/* Personal Information */}
                <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 3, mb: 2.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 2 }}>
                        Personal Information
                    </Typography>
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                placeholder="Dr. Juan Dela Cruz"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                placeholder="dentist@dentapp.com"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                placeholder="09xx-xxx-xxxx"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                error={!!errors.phone}
                                helperText={errors.phone}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Specialization"
                                value={data.specialization}
                                onChange={e => setData('specialization', e.target.value)}
                                error={!!errors.specialization}
                                helperText={errors.specialization}
                            >
                                {SPECIALIZATIONS.map(s => (
                                    <MenuItem key={s} value={s}>{s}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Status"
                                value={data.is_active}
                                onChange={e => setData('is_active', e.target.value)}
                                error={!!errors.is_active}
                                helperText={errors.is_active}
                            >
                                <MenuItem value={true}>Active</MenuItem>
                                <MenuItem value={false}>Inactive</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </Box>

                {/* Account Credentials */}
                <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 3, mb: 2.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 2 }}>
                        Login Credentials
                    </Typography>
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                placeholder="Min. 8 characters"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                error={!!errors.password}
                                helperText={errors.password ?? 'This will be the dentist\'s login password'}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Submit */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                        component={Link}
                        href="/dentists"
                        sx={{ borderRadius: 2.5, color: '#64748b' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={processing}
                        startIcon={processing ? <CircularProgress size={16} color="inherit" /> : <SaveRoundedIcon />}
                        sx={{ borderRadius: 2.5, px: 3 }}
                    >
                        Save Dentist
                    </Button>
                </Box>
            </form>
        </AppLayout>
    );
}