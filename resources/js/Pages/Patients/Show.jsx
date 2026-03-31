import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Box, Button, Typography, Avatar, Chip, Grid,
    Divider, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';

const AVATAR_COLORS = [
    '#0d9488','#3b82f6','#8b5cf6','#f59e0b',
    '#ef4444','#10b981','#0891b2','#6366f1',
];

const hashColor = (str = '') =>
    AVATAR_COLORS[str.charCodeAt(0) % AVATAR_COLORS.length];

const STATUS_MAP = {
    pending:     { label: 'Pending',     color: 'warning' },
    confirmed:   { label: 'Confirmed',   color: 'success' },
    waiting:     { label: 'Waiting',     color: 'info'    },
    in_progress: { label: 'In Progress', color: 'primary' },
    completed:   { label: 'Done',        color: 'default' },
    cancelled:   { label: 'Cancelled',   color: 'error'   },
    no_show:     { label: 'No Show',     color: 'error'   },
};

const fmt12h = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
};

function InfoRow({ label, value }) {
    return (
        <Box sx={{ display: 'flex', py: 1, borderBottom: '1px solid #f1f5f9' }}>
            <Typography sx={{ fontSize: '0.78rem', color: '#64748b', width: 180, flexShrink: 0 }}>
                {label}
            </Typography>
            <Typography sx={{ fontSize: '0.83rem', color: '#0f172a', fontWeight: 500 }}>
                {value ?? <span style={{ color: '#94a3b8' }}>—</span>}
            </Typography>
        </Box>
    );
}

export default function Show({ patient, appointments }) {
    return (
        <AppLayout title="Patient Profile">
            <Head title={patient.full_name} />

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
            </Box>

            <Grid container spacing={2.5}>

                {/* Left — Patient Info */}
                <Grid size={{ xs: 12, md: 4 }}>

                    {/* Profile Card */}
                    <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 3, mb: 2.5, textAlign: 'center' }}>
                        <Avatar sx={{
                            width: 72, height: 72,
                            bgcolor: hashColor(patient.initials),
                            fontSize: '1.5rem', fontWeight: 700,
                            mx: 'auto', mb: 1.5,
                        }}>
                            {patient.initials}
                        </Avatar>
                        <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 600, color: '#0f172a' }}>
                            {patient.full_name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: '#64748b', mt: 0.3, fontFamily: 'monospace' }}>
                            {patient.patient_no}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1.5 }}>
                            <Chip
                                label={patient.gender}
                                size="small"
                                sx={{ textTransform: 'capitalize', height: 22, fontSize: '0.7rem' }}
                            />
                            <Chip
                                label={`${patient.age} years old`}
                                size="small"
                                sx={{ height: 22, fontSize: '0.7rem' }}
                            />
                            <Chip
                                label={patient.is_active ? 'Active' : 'Inactive'}
                                color={patient.is_active ? 'success' : 'default'}
                                size="small"
                                sx={{ height: 22, fontSize: '0.7rem' }}
                            />
                        </Box>

                        <Button
                            variant="outlined"
                            fullWidth
                            component={Link}
                            href={`/patients/${patient.id}/edit`}
                            sx={{ mt: 1.5, borderRadius: 2.5 }}
                        >
                            Edit Patient
                        </Button>

                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<CalendarMonthRoundedIcon />}
                            component={Link}
                            href={`/appointments/create?patient_id=${patient.id}`}
                            sx={{ mt: 2.5, borderRadius: 2.5 }}
                        >
                            Book Appointment
                        </Button>
                    </Box>

                    {/* Contact Info */}
                    <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 3, mb: 2.5 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1.5 }}>
                            Contact Information
                        </Typography>
                        <InfoRow label="Phone" value={patient.phone} />
                        <InfoRow label="Email" value={patient.email} />
                        <InfoRow label="Barangay" value={patient.barangay} />
                        <InfoRow label="City / Municipality" value={patient.city} />
                        <InfoRow label="Province" value={patient.province} />
                    </Box>

                    {/* Emergency Contact */}
                    <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 3 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1.5 }}>
                            Emergency Contact
                        </Typography>
                        <InfoRow label="Name" value={patient.emergency_contact_name} />
                        <InfoRow label="Phone" value={patient.emergency_contact_phone} />
                    </Box>
                </Grid>

                {/* Right — Medical Info + Appointments */}
                <Grid size={{ xs: 12, md: 8 }}>

                    {/* Medical Info */}
                    <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 3, mb: 2.5 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1.5 }}>
                            Medical Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography sx={{ fontSize: '0.72rem', color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Medical History
                                </Typography>
                                <Typography sx={{ fontSize: '0.83rem', color: '#0f172a', lineHeight: 1.6 }}>
                                    {patient.medical_history ?? <span style={{ color: '#94a3b8' }}>None recorded</span>}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography sx={{ fontSize: '0.72rem', color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Allergies
                                </Typography>
                                <Typography sx={{ fontSize: '0.83rem', color: '#0f172a', lineHeight: 1.6 }}>
                                    {patient.allergies ?? <span style={{ color: '#94a3b8' }}>None recorded</span>}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography sx={{ fontSize: '0.72rem', color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Notes
                                </Typography>
                                <Typography sx={{ fontSize: '0.83rem', color: '#0f172a', lineHeight: 1.6 }}>
                                    {patient.notes ?? <span style={{ color: '#94a3b8' }}>None recorded</span>}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Appointment History */}
                    <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                Appointment History
                            </Typography>
                            <Chip label={`${appointments.length} total`} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                        {['Date', 'Treatment', 'Dentist', 'Time', 'Cost', 'Status'].map(col => (
                                            <TableCell key={col} sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {col}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {appointments.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#94a3b8', fontSize: '0.83rem' }}>
                                                No appointments yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {appointments.map((apt) => (
                                        <TableRow key={apt.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                            <TableCell sx={{ fontSize: '0.8rem', color: '#334155' }}>
                                                {apt.appointment_date}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', color: '#334155' }}>
                                                {apt.treatment_type}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', color: '#334155' }}>
                                                {apt.dentist_name}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', color: '#334155' }}>
                                                {fmt12h(apt.start_time)}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', color: '#334155' }}>
                                                {apt.estimated_cost
                                                    ? `₱${Number(apt.estimated_cost).toLocaleString('en-PH')}`
                                                    : <span style={{ color: '#94a3b8' }}>—</span>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={STATUS_MAP[apt.status]?.label ?? apt.status}
                                                    color={STATUS_MAP[apt.status]?.color ?? 'default'}
                                                    size="small"
                                                    sx={{ height: 20, fontSize: '0.68rem' }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid>
            </Grid>
        </AppLayout>
    );
}