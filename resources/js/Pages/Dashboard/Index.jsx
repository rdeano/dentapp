import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Box, Grid, Typography, Avatar, Chip,
    Button, List, ListItem, ListItemAvatar,
    ListItemText, Divider,
} from '@mui/material';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

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

function StatCard({ icon, value, label, iconBg, iconColor, prefix }) {
    return (
        <Box sx={{
            bgcolor: 'white', borderRadius: 3,
            border: '1px solid #e2e8f0', p: 2.5,
            display: 'flex', alignItems: 'center', gap: 2,
            transition: 'box-shadow .2s',
            '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.06)' },
        }}>
            <Box sx={{
                width: 50, height: 50, borderRadius: 2.5,
                bgcolor: iconBg, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
            }}>
                <Box sx={{ color: iconColor, '& svg': { fontSize: 22 } }}>
                    {icon}
                </Box>
            </Box>
            <Box>
                <Typography sx={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>
                    {prefix}{typeof value === 'number' ? value.toLocaleString('en-PH') : value}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#64748b', mt: 0.3 }}>
                    {label}
                </Typography>
            </Box>
        </Box>
    );
}

export default function Index({ stats, todayAppointments, upcomingAppointments }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* Greeting */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.6rem', fontWeight: 600, color: '#0f172a',
                    }}>
                        {greeting}, {user?.name} 👋
                    </Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: '#64748b', mt: 0.3 }}>
                        Here's what's happening at your clinic today.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    component={Link}
                    href="/appointments/create"
                    sx={{ borderRadius: 2.5 }}
                >
                    New Appointment
                </Button>
            </Box>

            {/* Stat Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        icon={<CalendarMonthRoundedIcon />}
                        value={stats.today_total}
                        label="Appointments today"
                        iconBg="#ccfbf1" iconColor="#0d9488"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        icon={<PeopleRoundedIcon />}
                        value={stats.total_patients}
                        label="Active patients"
                        iconBg="#dbeafe" iconColor="#3b82f6"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        icon={<AccessTimeRoundedIcon />}
                        value={stats.pending}
                        label="Pending today"
                        iconBg="#fef3c7" iconColor="#f59e0b"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        icon={<TrendingUpRoundedIcon />}
                        value={Number(stats.monthly_revenue)}
                        label="Revenue this month"
                        iconBg="#d1fae5" iconColor="#10b981"
                        prefix="₱"
                    />
                </Grid>
            </Grid>

            {/* Main Content */}
            <Grid container spacing={2.5}>

                {/* Today's Appointments */}
                <Grid size={{ xs: 12, lg: 7 }}>
                    <Box sx={{
                        bgcolor: 'white', borderRadius: 3,
                        border: '1px solid #e2e8f0', overflow: 'hidden',
                    }}>
                        <Box sx={{
                            px: 2.5, py: 2,
                            borderBottom: '1px solid #f1f5f9',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                                Today's Appointments
                            </Typography>
                            <Button
                                size="small"
                                component={Link}
                                href="/appointments"
                                sx={{ fontSize: '0.75rem', color: '#0d9488' }}
                            >
                                View all →
                            </Button>
                        </Box>

                        {todayAppointments.length === 0 ? (
                            <Box sx={{ py: 6, textAlign: 'center' }}>
                                <Typography sx={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                                    No appointments scheduled for today.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    component={Link}
                                    href="/appointments/create"
                                    sx={{ mt: 1.5, borderRadius: 2, fontSize: '0.78rem' }}
                                >
                                    Schedule one now
                                </Button>
                            </Box>
                        ) : (
                            <List disablePadding>
                                {todayAppointments.map((apt, i) => (
                                    <Box key={apt.id}>
                                        <ListItem sx={{
                                            px: 2.5, py: 1.2,
                                            '&:hover': { bgcolor: '#f8fafc' },
                                            cursor: 'pointer',
                                        }}>
                                            <Box sx={{ width: 60, flexShrink: 0 }}>
                                                <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>
                                                    {fmt12h(apt.start_time)}
                                                </Typography>
                                            </Box>
                                            <ListItemAvatar sx={{ minWidth: 44 }}>
                                                <Avatar sx={{
                                                    width: 34, height: 34,
                                                    bgcolor: hashColor(apt.patient_initials),
                                                    fontSize: '0.72rem', fontWeight: 600,
                                                }}>
                                                    {apt.patient_initials}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#0f172a' }}>
                                                        {apt.patient_name}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                        {apt.treatment_type} · {apt.dentist_name}
                                                    </Typography>
                                                }
                                            />
                                            <Chip
                                                label={STATUS_MAP[apt.status]?.label ?? apt.status}
                                                color={STATUS_MAP[apt.status]?.color ?? 'default'}
                                                size="small"
                                                sx={{ height: 22, fontSize: '0.68rem' }}
                                            />
                                        </ListItem>
                                        {i < todayAppointments.length - 1 && (
                                            <Divider sx={{ ml: 13 }} />
                                        )}
                                    </Box>
                                ))}
                            </List>
                        )}
                    </Box>
                </Grid>

                {/* Upcoming Appointments */}
                <Grid size={{ xs: 12, lg: 5 }}>
                    <Box sx={{
                        bgcolor: 'white', borderRadius: 3,
                        border: '1px solid #e2e8f0', overflow: 'hidden',
                    }}>
                        <Box sx={{
                            px: 2.5, py: 2,
                            borderBottom: '1px solid #f1f5f9',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                                Upcoming Appointments
                            </Typography>
                            <Button
                                size="small"
                                component={Link}
                                href="/appointments"
                                sx={{ fontSize: '0.75rem', color: '#0d9488' }}
                            >
                                View all →
                            </Button>
                        </Box>

                        {upcomingAppointments.length === 0 ? (
                            <Box sx={{ py: 6, textAlign: 'center' }}>
                                <Typography sx={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                                    No upcoming appointments.
                                </Typography>
                            </Box>
                        ) : (
                            <List disablePadding>
                                {upcomingAppointments.map((apt, i) => (
                                    <Box key={apt.id}>
                                        <ListItem sx={{
                                            px: 2.5, py: 1.2,
                                            '&:hover': { bgcolor: '#f8fafc' },
                                        }}>
                                            <ListItemAvatar sx={{ minWidth: 44 }}>
                                                <Avatar sx={{
                                                    width: 34, height: 34,
                                                    bgcolor: hashColor(apt.patient_name),
                                                    fontSize: '0.72rem', fontWeight: 600,
                                                }}>
                                                    {apt.patient_name?.charAt(0)}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#0f172a' }}>
                                                        {apt.patient_name}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                        {apt.treatment_type} · {apt.dentist_name}
                                                    </Typography>
                                                }
                                            />
                                            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#0f172a' }}>
                                                    {apt.date}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                                    {fmt12h(apt.start_time)}
                                                </Typography>
                                            </Box>
                                        </ListItem>
                                        {i < upcomingAppointments.length - 1 && (
                                            <Divider sx={{ ml: 7 }} />
                                        )}
                                    </Box>
                                ))}
                            </List>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </AppLayout>
    );
}