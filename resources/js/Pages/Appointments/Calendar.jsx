import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState } from 'react';
import {
    Box, Button, Typography, Chip, Paper,
    Dialog, DialogTitle, DialogContent,
    DialogActions, Divider,
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';

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

export default function Calendar({ appointments }) {
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleEventClick = (info) => {
        setSelectedEvent({
            id:           info.event.id,
            title:        info.event.title,
            start:        info.event.startStr,
            end:          info.event.endStr,
            ...info.event.extendedProps,
        });
    };

    const handleDateClick = (info) => {
        router.visit(`/appointments/create?date=${info.dateStr}`);
    };

    const handleClose = () => setSelectedEvent(null);

    return (
        <AppLayout title="Appointment Calendar">
            <Head title="Calendar" />

            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>
                        Appointment Calendar
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mt: 0.3 }}>
                        Click a date to schedule · Click an event to view details
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ViewListRoundedIcon />}
                        component={Link}
                        href="/appointments"
                        sx={{ borderRadius: 2.5, fontSize: '0.83rem' }}
                    >
                        List View
                    </Button>
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
            </Box>

            {/* Legend */}
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                {[
                    { label: 'Confirmed',   color: '#0d9488' },
                    { label: 'Pending',     color: '#f59e0b' },
                    { label: 'In Progress', color: '#3b82f6' },
                    { label: 'Completed',   color: '#10b981' },
                    { label: 'Waiting',     color: '#0891b2' },
                    { label: 'Cancelled',   color: '#ef4444' },
                ].map(item => (
                    <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {item.label}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Calendar */}
            <Box sx={{
                bgcolor: 'white', borderRadius: 3,
                border: '1px solid #e2e8f0', overflow: 'hidden',
                p: 2,
                '& .fc': { fontFamily: "'DM Sans', sans-serif" },
                '& .fc-toolbar-title': { fontSize: '1rem !important', fontWeight: '600 !important', color: '#0f172a' },
                '& .fc-button': {
                    bgcolor: '#f8fafc !important',
                    border: '1px solid #e2e8f0 !important',
                    color: '#334155 !important',
                    borderRadius: '8px !important',
                    fontSize: '0.78rem !important',
                    fontWeight: '500 !important',
                    boxShadow: 'none !important',
                    '&:hover': { bgcolor: '#f1f5f9 !important' },
                },
                '& .fc-button-active': {
                    bgcolor: '#0d9488 !important',
                    color: 'white !important',
                    borderColor: '#0d9488 !important',
                },
                '& .fc-daygrid-day:hover': { bgcolor: '#f8fafc', cursor: 'pointer' },
                '& .fc-event': { cursor: 'pointer', borderRadius: '6px !important', fontSize: '0.75rem !important', px: '4px' },
                '& .fc-day-today': { bgcolor: '#f0fdfa !important' },
                '& .fc-col-header-cell': { bgcolor: '#f8fafc', py: 1 },
                '& .fc-col-header-cell-cushion': { fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textDecoration: 'none' },
                '& .fc-daygrid-day-number': { fontSize: '0.8rem', color: '#334155', textDecoration: 'none' },
            }}>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left:   'prev,next today',
                        center: 'title',
                        right:  'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    buttonText={{
                        today: 'Today',
                        month: 'Month',
                        week:  'Week',
                        day:   'Day',
                    }}
                    events={appointments}
                    eventClick={handleEventClick}
                    dateClick={handleDateClick}
                    height="auto"
                    eventDisplay="block"
                    dayMaxEvents={3}
                />
            </Box>

            {/* Event Detail Dialog */}
            <Dialog
                open={!!selectedEvent}
                onClose={handleClose}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3, border: '1px solid #e2e8f0' } }}
            >
                {selectedEvent && (
                    <>
                        <DialogTitle sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.1rem', fontWeight: 600,
                            color: '#0f172a', pb: 1,
                        }}>
                            Appointment Details
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Box>
                                    <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Patient
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>
                                        {selectedEvent.patient_name}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box>
                                    <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Treatment
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.875rem', color: '#334155' }}>
                                        {selectedEvent.treatment_type}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Dentist
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.875rem', color: '#334155' }}>
                                        {selectedEvent.dentist_name}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Time
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.875rem', color: '#334155' }}>
                                        {fmt12h(selectedEvent.start?.split('T')[1]?.substring(0, 5))} — {fmt12h(selectedEvent.end?.split('T')[1]?.substring(0, 5))}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Estimated Cost
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.875rem', color: '#334155' }}>
                                        {selectedEvent.estimated_cost
                                            ? `₱${Number(selectedEvent.estimated_cost).toLocaleString('en-PH')}`
                                            : '—'
                                        }
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
                                        Status
                                    </Typography>
                                    <Chip
                                        label={STATUS_MAP[selectedEvent.status]?.label ?? selectedEvent.status}
                                        color={STATUS_MAP[selectedEvent.status]?.color ?? 'default'}
                                        size="small"
                                        sx={{ height: 22, fontSize: '0.7rem' }}
                                    />
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                            <Button
                                onClick={handleClose}
                                sx={{ borderRadius: 2, color: '#64748b', fontSize: '0.83rem' }}
                            >
                                Close
                            </Button>
                            <Button
                                variant="contained"
                                component={Link}
                                href={`/appointments/${selectedEvent.id}/edit`}
                                onClick={handleClose}
                                sx={{ borderRadius: 2, fontSize: '0.83rem' }}
                            >
                                Edit Appointment
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </AppLayout>
    );
}