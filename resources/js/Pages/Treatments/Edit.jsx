import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Box, Button, TextField, Typography,
    Grid, CircularProgress, Switch, FormControlLabel,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

export default function Edit({ treatment }) {
    const { data, setData, put, processing, errors } = useForm({
        name:             treatment.name,
        description:      treatment.description ?? '',
        default_price:    treatment.default_price ?? '',
        duration_minutes: treatment.duration_minutes,
        is_active:        treatment.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/treatments/${treatment.id}`);
    };

    return (
        <AppLayout title="Edit Treatment">
            <Head title="Edit Treatment" />

            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Button
                    component={Link}
                    href="/treatments"
                    startIcon={<ArrowBackRoundedIcon />}
                    sx={{ color: '#64748b', borderRadius: 2 }}
                >
                    Back
                </Button>
                <Box>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>
                        Edit Treatment
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Update treatment details
                    </Typography>
                </Box>
            </Box>

            <form onSubmit={submit}>
                <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 3, mb: 2.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 2 }}>
                        Treatment Details
                    </Typography>
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Treatment Name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                fullWidth
                                label="Default Price (₱)"
                                type="number"
                                value={data.default_price}
                                onChange={e => setData('default_price', e.target.value)}
                                error={!!errors.default_price}
                                helperText={errors.default_price}
                                InputProps={{ inputProps: { min: 0, step: '0.01' } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                fullWidth
                                label="Duration (minutes)"
                                type="number"
                                value={data.duration_minutes}
                                onChange={e => setData('duration_minutes', e.target.value)}
                                error={!!errors.duration_minutes}
                                helperText={errors.duration_minutes}
                                InputProps={{ inputProps: { min: 5, step: 5 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                placeholder="Brief description of this treatment..."
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                error={!!errors.description}
                                helperText={errors.description}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={data.is_active}
                                        onChange={e => setData('is_active', e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>
                                        Active — visible when creating appointments
                                    </Typography>
                                }
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Submit */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                        component={Link}
                        href="/treatments"
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
                        Update Treatment
                    </Button>
                </Box>
            </form>
        </AppLayout>
    );
}