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

export default function Edit({ dentist }) {
    const { data, setData, put, processing, errors } = useForm({
        name:           dentist.name,
        email:          dentist.email,
        password:       '',
        phone:          dentist.phone ?? '',
        specialization: dentist.specialization ?? '',
        is_active:      dentist.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/dentists/${dentist.id}`);
    };

    return (
        <AppLayout title="Edit Dentist">
            <Head title="Edit Dentist" />

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
                        Edit Dentist
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Update dentist information
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

                {/* Password */}
                <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 3, mb: 2.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 2 }}>
                        Change Password
                    </Typography>
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="New Password"
                                type="password"
                                placeholder="Leave blank to keep current password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                error={!!errors.password}
                                helperText={errors.password ?? 'Leave blank to keep the current password'}
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
                        Update Dentist
                    </Button>
                </Box>
            </form>
        </AppLayout>
    );
}