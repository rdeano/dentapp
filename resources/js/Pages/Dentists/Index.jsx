import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState, useEffect } from 'react';
import {
    Box, Button, Typography, Avatar, Chip,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Tooltip,
    TextField, MenuItem, InputAdornment,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';

const AVATAR_COLORS = [
    '#0d9488','#3b82f6','#8b5cf6','#f59e0b',
    '#ef4444','#10b981','#0891b2','#6366f1',
];

const hashColor = (str = '') =>
    AVATAR_COLORS[str.charCodeAt(0) % AVATAR_COLORS.length];

export default function Index({ dentists, filters }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get('/dentists', {
                search: search || undefined,
                status: status || undefined,
            }, { preserveState: true, replace: true });
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, status]);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to remove this dentist?')) {
            router.delete(`/dentists/${id}`);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
    };

    const hasFilters = search || status;

    return (
        <AppLayout title="Dentists">
            <Head title="Dentists" />

            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>
                        Dentists
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mt: 0.3 }}>
                        Manage all dentists in your clinic
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    component={Link}
                    href="/dentists/create"
                    sx={{ borderRadius: 2.5 }}
                >
                    Add Dentist
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
                    placeholder="Search by name, email or specialization..."
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
                    sx={{ minWidth: 130 }}
                    SelectProps={{ sx: { borderRadius: 2, fontSize: '0.83rem' } }}
                >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>

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
                                {['Dentist', 'Email', 'Phone', 'Specialization', 'Today', 'Total Apts', 'Status', 'Actions'].map(col => (
                                    <TableCell key={col} sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {col}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dentists.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6, color: '#94a3b8', fontSize: '0.875rem' }}>
                                        {hasFilters ? 'No dentists match your search.' : 'No dentists found. Add your first dentist!'}
                                    </TableCell>
                                </TableRow>
                            )}
                            {dentists.data.map((dentist) => (
                                <TableRow
                                    key={dentist.id}
                                    sx={{ '&:hover': { bgcolor: '#f8fafc' }, transition: 'background .15s' }}
                                >
                                    {/* Name */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{
                                                width: 36, height: 36,
                                                bgcolor: hashColor(dentist.initials),
                                                fontSize: '0.75rem', fontWeight: 600,
                                            }}>
                                                {dentist.initials}
                                            </Avatar>
                                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#0f172a' }}>
                                                {dentist.name}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    {/* Email */}
                                    <TableCell sx={{ fontSize: '0.83rem', color: '#334155' }}>
                                        {dentist.email}
                                    </TableCell>

                                    {/* Phone */}
                                    <TableCell sx={{ fontSize: '0.83rem', color: '#334155' }}>
                                        {dentist.phone ?? <span style={{ color: '#94a3b8' }}>—</span>}
                                    </TableCell>

                                    {/* Specialization */}
                                    <TableCell sx={{ fontSize: '0.83rem', color: '#334155' }}>
                                        {dentist.specialization ?? <span style={{ color: '#94a3b8' }}>—</span>}
                                    </TableCell>

                                    {/* Today's Appointments */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                            <CalendarMonthRoundedIcon sx={{ fontSize: 14, color: '#0d9488' }} />
                                            <Typography sx={{ fontSize: '0.83rem', color: '#0f172a', fontWeight: 500 }}>
                                                {dentist.today_appointments}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    {/* Total Appointments */}
                                    <TableCell sx={{ fontSize: '0.83rem', color: '#334155' }}>
                                        {dentist.total_appointments}
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <Chip
                                            label={dentist.is_active ? 'Active' : 'Inactive'}
                                            color={dentist.is_active ? 'success' : 'default'}
                                            size="small"
                                            sx={{ height: 22, fontSize: '0.7rem' }}
                                        />
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    size="small"
                                                    component={Link}
                                                    href={`/dentists/${dentist.id}/edit`}
                                                    sx={{ color: '#0d9488', '&:hover': { bgcolor: '#ccfbf1' } }}
                                                >
                                                    <EditRoundedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDelete(dentist.id)}
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
                {dentists.last_page > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, p: 2, borderTop: '1px solid #f1f5f9' }}>
                        {dentists.links.map((link, i) => (
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