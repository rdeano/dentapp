import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Box, Button, TextField, Typography, MenuItem,
    Grid, Divider, CircularProgress, Alert,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

export default function Create({ patients, dentists, treatments }) {
    const { data, setData, post, processing, errors } = useForm({
        patient_id:       '',
        dentist_id:       '',
        appointment_date: '',
        start_time:       '',
        end_time:         '',
        treatment_type:   '',
        chief_complaint:  '',
        notes:            '',
        estimated_cost:   '',
        status:           'pending',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/appointments');
    };

    return (
        <AppLayout title="New Appointment">
            <Head title="New Appointment" />

            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Button
                    component={Link}
                    href="/appointments"
                    startIcon={<ArrowBackRoundedIcon />}
                    sx={{ color: '#64748b', borderRadius: 2 }}
                >
                    Back
                </Button>
                <Box>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>
                        New Appointment
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Fill in the details below to schedule an appointment
                    </Typography>
                </Box>
            </Box>

            <form onSubmit={submit}>
                <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 3 }}>

                    {/* Patient & Dentist */}
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 2 }}>
                        Appointment Details
                    </Typography>

                    <Grid container spacing={2.5}>
                        <Grid item size={{xs : 12, md :6}}>
                            <TextField
                                select
                                fullWidth
                                label="Patient"
                                value={data.patient_id}
                                onChange={e => setData('patient_id', e.target.value)}
                                error={!!errors.patient_id}
                                helperText={errors.patient_id}
                            >
                                {patients.map(p => (
                                    <MenuItem key={p.id} value={p.id}>
                                        {p.name} — {p.no}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item size={{xs : 12, md :6}}>
                            <TextField
                                select
                                fullWidth
                                label="Dentist"
                                value={data.dentist_id}
                                onChange={e => setData('dentist_id', e.target.value)}
                                error={!!errors.dentist_id}
                                helperText={errors.dentist_id}
                            >
                                {dentists.map(d => (
                                    <MenuItem key={d.id} value={d.id}>
                                        {d.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item size={{xs : 12, md :6}}>
                            <TextField
                                select
                                fullWidth
                                label="Treatment Type"
                                value={data.treatment_type}
                                onChange={e => {
                                    const selected = treatments.find(t => t.name === e.target.value);
                                    setData(data => ({
                                        ...data,
                                        treatment_type: e.target.value,
                                        estimated_cost: selected?.default_price ?? data.estimated_cost,
                                    }));
                                }}
                                error={!!errors.treatment_type}
                                helperText={errors.treatment_type}
                            >
                            {treatments.map(t => (
                                  <MenuItem key={t.id} value={t.name}>{t.name}</MenuItem>
                              ))}
                            </TextField>
                        </Grid>
                        <Grid item size={{xs : 12, md :6}}>
                            <TextField
                                select
                                fullWidth
                                label="Status"
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                error={!!errors.status}
                                helperText={errors.status}
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="confirmed">Confirmed</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* Schedule */}
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 2 }}>
                        Schedule
                    </Typography>
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Appointment Date"
                                value={data.appointment_date}
                                onChange={e => setData('appointment_date', e.target.value)}
                                error={!!errors.appointment_date}
                                helperText={errors.appointment_date}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                type="time"
                                label="Start Time"
                                value={data.start_time}
                                onChange={e => setData('start_time', e.target.value)}
                                error={!!errors.start_time}
                                helperText={errors.start_time}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                type="time"
                                label="End Time"
                                value={data.end_time}
                                onChange={e => setData('end_time', e.target.value)}
                                error={!!errors.end_time}
                                helperText={errors.end_time}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* Clinical Notes */}
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 2 }}>
                        Clinical Notes
                    </Typography>
                    <Grid container spacing={2.5}>
                        <Grid item size={{xs : 12, md :6}}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Chief Complaint"
                                placeholder="e.g. Toothache on lower left molar"
                                value={data.chief_complaint}
                                onChange={e => setData('chief_complaint', e.target.value)}
                                error={!!errors.chief_complaint}
                                helperText={errors.chief_complaint}
                            />
                        </Grid>
                        <Grid item size={{xs : 12, md :6}}>
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
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Estimated Cost (₱)"
                                type="number"
                                placeholder="0.00"
                                value={data.estimated_cost}
                                onChange={e => setData('estimated_cost', e.target.value)}
                                error={!!errors.estimated_cost}
                                helperText={errors.estimated_cost}
                                InputProps={{ inputProps: { min: 0, step: '0.01' } }}
                            />
                        </Grid>
                    </Grid>

                    {/* Submit */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <Button
                            component={Link}
                            href="/appointments"
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
                            Save Appointment
                        </Button>
                    </Box>
                </Box>
            </form>
        </AppLayout>
    );
}