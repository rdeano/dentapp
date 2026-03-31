import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Box, Button, TextField, Typography, MenuItem,
    Grid, Divider, CircularProgress,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        first_name:               '',
        middle_name:              '',
        last_name:                '',
        gender:                   '',
        date_of_birth:            '',
        email:                    '',
        phone:                    '',
        barangay:                 '',
        city:                     '',
        province:                 '',
        emergency_contact_name:   '',
        emergency_contact_phone:  '',
        medical_history:          '',
        allergies:                '',
        notes:                    '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/patients');
    };

    return (
        <AppLayout title="New Patient">
            <Head title="New Patient" />

            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Button
                    component={Link}
                    href="/patients"
                    startIcon={<ArrowBackRoundedIcon />}
                    sx={{ color: '#64748b', borderRadius: 2 }}
                >
                    Back
                </Button>
                <Box>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>
                        New Patient
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Fill in the patient's personal and medical information
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
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="First Name"
                                value={data.first_name}
                                onChange={e => setData('first_name', e.target.value)}
                                error={!!errors.first_name}
                                helperText={errors.first_name}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Middle Name"
                                value={data.middle_name}
                                onChange={e => setData('middle_name', e.target.value)}
                                error={!!errors.middle_name}
                                helperText={errors.middle_name}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                value={data.last_name}
                                onChange={e => setData('last_name', e.target.value)}
                                error={!!errors.last_name}
                                helperText={errors.last_name}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                select
                                fullWidth
                                label="Gender"
                                value={data.gender}
                                onChange={e => setData('gender', e.target.value)}
                                error={!!errors.gender}
                                helperText={errors.gender}
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date of Birth"
                                value={data.date_of_birth}
                                onChange={e => setData('date_of_birth', e.target.value)}
                                error={!!errors.date_of_birth}
                                helperText={errors.date_of_birth}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
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
                                fullWidth
                                label="Email Address"
                                type="email"
                                placeholder="patient@email.com"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Address */}
                <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 3, mb: 2.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 2 }}>
                        Address
                    </Typography>
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Barangay"
                                value={data.barangay}
                                onChange={e => setData('barangay', e.target.value)}
                                error={!!errors.barangay}
                                helperText={errors.barangay}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="City / Municipality"
                                value={data.city}
                                onChange={e => setData('city', e.target.value)}
                                error={!!errors.city}
                                helperText={errors.city}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Province"
                                value={data.province}
                                onChange={e => setData('province', e.target.value)}
                                error={!!errors.province}
                                helperText={errors.province}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Emergency Contact */}
                <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 3, mb: 2.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 2 }}>
                        Emergency Contact
                    </Typography>
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Contact Name"
                                value={data.emergency_contact_name}
                                onChange={e => setData('emergency_contact_name', e.target.value)}
                                error={!!errors.emergency_contact_name}
                                helperText={errors.emergency_contact_name}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Contact Phone"
                                placeholder="09xx-xxx-xxxx"
                                value={data.emergency_contact_phone}
                                onChange={e => setData('emergency_contact_phone', e.target.value)}
                                error={!!errors.emergency_contact_phone}
                                helperText={errors.emergency_contact_phone}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Medical Information */}
                <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 3, mb: 2.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 2 }}>
                        Medical Information
                    </Typography>
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Medical History"
                                placeholder="e.g. Hypertension, Diabetes..."
                                value={data.medical_history}
                                onChange={e => setData('medical_history', e.target.value)}
                                error={!!errors.medical_history}
                                helperText={errors.medical_history}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Allergies"
                                placeholder="e.g. Penicillin, Latex..."
                                value={data.allergies}
                                onChange={e => setData('allergies', e.target.value)}
                                error={!!errors.allergies}
                                helperText={errors.allergies}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Notes"
                                placeholder="Additional notes..."
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                error={!!errors.notes}
                                helperText={errors.notes}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Submit */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                        component={Link}
                        href="/patients"
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
                        Save Patient
                    </Button>
                </Box>
            </form>
        </AppLayout>
    );
}