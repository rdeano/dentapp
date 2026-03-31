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
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';

const AVATAR_COLORS = [
    '#0d9488','#3b82f6','#8b5cf6','#f59e0b',
    '#ef4444','#10b981','#0891b2','#6366f1',
];

const hashColor = (str = '') =>
    AVATAR_COLORS[str.charCodeAt(0) % AVATAR_COLORS.length];

export default function Index({ patients, filters }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [gender, setGender] = useState(filters.gender ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get('/patients', {
                search: search || undefined,
                gender: gender || undefined,
                status: status || undefined,
            }, { preserveState: true, replace: true });
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, gender, status]);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this patient?')) {
            router.delete(`/patients/${id}`);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setGender('');
        setStatus('');
    };

    const hasFilters = search || gender || status;

    return (
        <AppLayout title="Patients">
            <Head title="Patients" />

            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>
                        Patients
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mt: 0.3 }}>
                        Manage all registered patients
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    component={Link}
                    href="/patients/create"
                    sx={{ borderRadius: 2.5 }}
                >
                    New Patient
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
                    placeholder="Search by name, phone or patient no..."
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

                {/* Gender Filter */}
                <TextField
                    select
                    size="small"
                    label="Gender"
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    sx={{ minWidth: 130 }}
                    SelectProps={{ sx: { borderRadius: 2, fontSize: '0.83rem' } }}
                >
                    <MenuItem value="">All Genders</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                </TextField>

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
                                {['Patient', 'Patient No.', 'Gender', 'Age', 'Phone', 'City', 'Status', 'Actions'].map(col => (
                                    <TableCell key={col} sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {col}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {patients.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6, color: '#94a3b8', fontSize: '0.875rem' }}>
                                        {hasFilters ? 'No patients match your search.' : 'No patients found. Add your first patient!'}
                                    </TableCell>
                                </TableRow>
                            )}
                            {patients.data.map((patient) => (
                                <TableRow
                                    key={patient.id}
                                    sx={{ '&:hover': { bgcolor: '#f8fafc' }, transition: 'background .15s' }}
                                >
                                    {/* Name */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                            <Avatar sx={{
                                                width: 32, height: 32,
                                                bgcolor: hashColor(patient.initials),
                                                fontSize: '0.7rem', fontWeight: 600,
                                            }}>
                                                {patient.initials}
                                            </Avatar>
                                            <Typography sx={{ fontSize: '0.83rem', fontWeight: 500, color: '#0f172a' }}>
                                                {patient.full_name}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    {/* Patient No */}
                                    <TableCell sx={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'monospace' }}>
                                        {patient.patient_no}
                                    </TableCell>

                                    {/* Gender */}
                                    <TableCell sx={{ fontSize: '0.83rem', color: '#334155', textTransform: 'capitalize' }}>
                                        {patient.gender}
                                    </TableCell>

                                    {/* Age */}
                                    <TableCell sx={{ fontSize: '0.83rem', color: '#334155' }}>
                                        {patient.age} yrs
                                    </TableCell>

                                    {/* Phone */}
                                    <TableCell sx={{ fontSize: '0.83rem', color: '#334155' }}>
                                        {patient.phone}
                                    </TableCell>

                                    {/* City */}
                                    <TableCell sx={{ fontSize: '0.83rem', color: '#334155' }}>
                                        {patient.city ?? <span style={{ color: '#94a3b8' }}>—</span>}
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <Chip
                                            label={patient.is_active ? 'Active' : 'Inactive'}
                                            color={patient.is_active ? 'success' : 'default'}
                                            size="small"
                                            sx={{ height: 22, fontSize: '0.7rem' }}
                                        />
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <Tooltip title="View Profile">
                                                <IconButton
                                                    size="small"
                                                    component={Link}
                                                    href={`/patients/${patient.id}`}
                                                    sx={{ color: '#0d9488', '&:hover': { bgcolor: '#ccfbf1' } }}
                                                >
                                                    <VisibilityRoundedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    size="small"
                                                    component={Link}
                                                    href={`/patients/${patient.id}/edit`}
                                                    sx={{ color: '#3b82f6', '&:hover': { bgcolor: '#dbeafe' } }}
                                                >
                                                    <EditRoundedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDelete(patient.id)}
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
                {patients.last_page > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, p: 2, borderTop: '1px solid #f1f5f9' }}>
                        {patients.links.map((link, i) => (
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