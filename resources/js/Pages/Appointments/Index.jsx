import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState, useEffect } from 'react';
import {
    Box, Button, Chip, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Typography,
    IconButton, Tooltip, Avatar, MenuItem, Select,
    TextField, InputAdornment,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
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

const AVATAR_COLORS = [
    '#0d9488','#3b82f6','#8b5cf6','#f59e0b',
    '#ef4444','#10b981','#0891b2','#6366f1',
];

const hashColor = (str = '') =>
    AVATAR_COLORS[str.charCodeAt(0) % AVATAR_COLORS.length];

const fmt12h = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
};

export default function Index({ appointments, filters }) {
    const [search, setSearch]   = useState(filters.search ?? '');
    const [status, setStatus]   = useState(filters.status ?? '');
    const [date, setDate]       = useState(filters.date ?? '');

    // Debounce search
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get('/appointments', {
                search: search || undefined,
                status: status || undefined,
                date:   date || undefined,
            }, { preserveState: true, replace: true });
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, status, date]);

    const handleStatusChange = (id, status) => {
        router.patch(`/appointments/${id}/status`, { status });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this appointment?')) {
            router.delete(`/appointments/${id}`);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        setDate('');
    };

    const hasFilters = search || status || date;

    return (
        <AppLayout title="Appointments">
            <Head title="Appointments" />

            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>
                        Appointments
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mt: 0.3 }}>
                        Manage all clinic appointments
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<CalendarMonthRoundedIcon />}
                    component={Link}
                    href="/appointments/calendar"
                    sx={{ borderRadius: 2.5}}
                >
                    Calendar View
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

            {/* Search & Filters */}
            <Box sx={{
                bgcolor: 'white', borderRadius: 3,
                border: '1px solid #e2e8f0', p: 2,
                mb: 2, display: 'flex', gap: 1.5,
                alignItems: 'center', flexWrap: 'wrap',
            }}>
                <FilterListRoundedIcon sx={{ color: '#94a3b8', fontSize: 18 }} />

                {/* Search */}
                <TextField
                    size="small"
                    placeholder="Search patient or appointment no..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchRoundedIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 2, fontSize: '0.83rem' },
                    }}
                    sx={{ flex: 1, minWidth: 200 }}
                />

                {/* Status Filter */}
                <TextField
                    select
                    size="small"
                    label="Status"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    sx={{ minWidth: 140 }}
                    SelectProps={{ sx: { borderRadius: 2, fontSize: '0.83rem' } }}
                >
                    <MenuItem value="">All Status</MenuItem>
                    {Object.entries(STATUS_MAP).map(([val, { label }]) => (
                        <MenuItem key={val} value={val}>{label}</MenuItem>
                    ))}
                </TextField>

                {/* Date Filter */}
                <TextField
                    size="small"
                    type="date"
                    label="Date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: 150 }}
                    InputProps={{ sx: { borderRadius: 2, fontSize: '0.83rem' } }}
                />

                {/* Clear Filters */}
                {hasFilters && (
                    <Button
                        size="small"
                        onClick={clearFilters}
                        sx={{ color: '#ef4444', fontSize: '0.78rem', borderRadius: 2 }}
                    >
                        Clear
                    </Button>
                )}
            </Box>

            {/* Table */}
            <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                {['Patient', 'Dentist', 'Treatment', 'Date & Time', 'Cost', 'Status', 'Actions'].map(col => (
                                    <TableCell key={col} sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {col}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointments.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, color: '#94a3b8', fontSize: '0.875rem' }}>
                                        {hasFilters ? 'No appointments match your search.' : 'No appointments found. Create your first one!'}
                                    </TableCell>
                                </TableRow>
                            )}
                            {appointments.data.map((apt) => (
                                <TableRow
                                    key={apt.id}
                                    sx={{ '&:hover': { bgcolor: '#f8fafc' }, transition: 'background .15s' }}
                                >
                                    {/* Patient */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: hashColor(apt.patient_initials), fontSize: '0.7rem', fontWeight: 600 }}>
                                                {apt.patient_initials}
                                            </Avatar>
                                            <Typography sx={{ fontSize: '0.83rem', fontWeight: 500, color: '#0f172a' }}>
                                                {apt.patient_name}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    {/* Dentist */}
                                    <TableCell sx={{ fontSize: '0.83rem', color: '#334155' }}>
                                        {apt.dentist_name}
                                    </TableCell>

                                    {/* Treatment */}
                                    <TableCell sx={{ fontSize: '0.83rem', color: '#334155' }}>
                                        {apt.treatment_type}
                                    </TableCell>

                                    {/* Date & Time */}
                                    <TableCell>
                                        <Typography sx={{ fontSize: '0.83rem', color: '#334155' }}>
                                            {apt.appointment_date}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                            {fmt12h(apt.start_time)} — {fmt12h(apt.end_time)}
                                        </Typography>
                                    </TableCell>

                                    {/* Cost */}
                                    <TableCell sx={{ fontSize: '0.83rem', color: '#334155' }}>
                                        {apt.estimated_cost
                                            ? `₱${parseFloat(apt.estimated_cost).toLocaleString('en-PH')}`
                                            : <span style={{ color: '#94a3b8' }}>—</span>
                                        }
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <Select
                                            value={apt.status}
                                            onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                                            size="small"
                                            sx={{
                                                fontSize: '0.75rem',
                                                borderRadius: 2,
                                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                                bgcolor: apt.status === 'completed'   ? '#f1f5f9'
                                                    : apt.status === 'confirmed'   ? '#dcfce7'
                                                    : apt.status === 'cancelled'   ? '#fee2e2'
                                                    : apt.status === 'in_progress' ? '#dbeafe'
                                                    : apt.status === 'waiting'     ? '#e0f2fe'
                                                    : '#fef9c3',
                                            }}
                                        >
                                            {Object.entries(STATUS_MAP).map(([val, { label }]) => (
                                                <MenuItem key={val} value={val} sx={{ fontSize: '0.8rem' }}>
                                                    {label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    size="small"
                                                    component={Link}
                                                    href={`/appointments/${apt.id}/edit`}
                                                    sx={{ color: '#0d9488', '&:hover': { bgcolor: '#ccfbf1' } }}
                                                >
                                                    <EditRoundedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDelete(apt.id)}
                                                    sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}
                                                >
                                                    <DeleteRoundedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                {appointments.last_page > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, p: 2, borderTop: '1px solid #f1f5f9' }}>
                        {appointments.links.map((link, i) => (
                            <Button
                                key={i}
                                size="small"
                                variant={link.active ? 'contained' : 'outlined'}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                sx={{ minWidth: 36, borderRadius: 2, fontSize: '0.78rem' }}
                            >
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            </Button>
                        ))}
                    </Box>
                )}
            </Box>
        </AppLayout>
    );
}