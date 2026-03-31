import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Box, Button, TextField, Typography, MenuItem,
    Grid, Divider, CircularProgress,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

const PAYMENT_METHODS = [
    { value: 'cash',          label: 'Cash' },
    { value: 'gcash',         label: 'GCash' },
    { value: 'maya',          label: 'Maya' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'credit_card',   label: 'Credit Card' },
];

export default function Create({ patients, appointments }) {
    const { data, setData, post, processing, errors } = useForm({
        patient_id:      '',
        appointment_id:  '',
        amount:          '',
        payment_method:  'cash',
        status:          'paid',
        payment_date:    new Date().toISOString().split('T')[0],
        notes:           '',
    });

    // Filter appointments by selected patient
    const filteredAppointments = appointments.filter(
        a => !data.patient_id || a.patient_id === data.patient_id
    );

    const handlePatientChange = (e) => {
        setData(data => ({
            ...data,
            patient_id:     e.target.value,
            appointment_id: '',
            amount:         '',
        }));
    };

    const handleAppointmentChange = (e) => {
        const selected = appointments.find(a => a.id === e.target.value);
        setData(data => ({
            ...data,
            appointment_id: e.target.value,
            amount: selected?.estimated_cost ?? data.amount,
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        post('/payments');
    };

    return (
        <AppLayout title="Record Payment">
            <Head title="Record Payment" />

            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Button
                    component={Link}
                    href="/payments"
                    startIcon={<ArrowBackRoundedIcon />}
                    sx={{ color: '#64748b', borderRadius: 2 }}
                >
                    Back
                </Button>
                <Box>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>
                        Record Payment
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Record a new payment for a patient
                    </Typography>
                </Box>
            </Box>

            <form onSubmit={submit}>
                <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 3, mb: 2.5 }}>

                    {/* Patient & Appointment */}
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 2 }}>
                        Payment Details
                    </Typography>
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Patient"
                                value={data.patient_id}
                                onChange={handlePatientChange}
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
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Appointment (optional)"
                                value={data.appointment_id}
                                onChange={handleAppointmentChange}
                                error={!!errors.appointment_id}
                                helperText={errors.appointment_id ?? 'Selecting an appointment will auto-fill the amount'}
                                disabled={!data.patient_id}
                            >
                                <MenuItem value="">No linked appointment</MenuItem>
                                {filteredAppointments.map(a => (
                                    <MenuItem key={a.id} value={a.id}>
                                        {a.appointment_no} — {a.treatment_type} ({a.date})
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* Payment Info */}
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 2 }}>
                        Payment Information
                    </Typography>
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                fullWidth
                                label="Amount (₱)"
                                type="number"
                                placeholder="0.00"
                                value={data.amount}
                                onChange={e => setData('amount', e.target.value)}
                                error={!!errors.amount}
                                helperText={errors.amount}
                                InputProps={{ inputProps: { min: 0, step: '0.01' } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                select
                                fullWidth
                                label="Payment Method"
                                value={data.payment_method}
                                onChange={e => setData('payment_method', e.target.value)}
                                error={!!errors.payment_method}
                                helperText={errors.payment_method}
                            >
                                {PAYMENT_METHODS.map(m => (
                                    <MenuItem key={m.value} value={m.value}>
                                        {m.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                select
                                fullWidth
                                label="Status"
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                error={!!errors.status}
                                helperText={errors.status}
                            >
                                <MenuItem value="paid">Paid</MenuItem>
                                <MenuItem value="unpaid">Unpaid</MenuItem>
                                <MenuItem value="partial">Partial</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Payment Date"
                                value={data.payment_date}
                                onChange={e => setData('payment_date', e.target.value)}
                                error={!!errors.payment_date}
                                helperText={errors.payment_date}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Notes"
                                placeholder="e.g. Partial payment, balance to follow..."
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
                        href="/payments"
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
                        Save Payment
                    </Button>
                </Box>
            </form>
        </AppLayout>
    );
}