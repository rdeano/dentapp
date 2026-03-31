import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState, useEffect } from 'react';
import {
    Box, Button, Typography, Chip,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Tooltip,
    TextField, MenuItem, InputAdornment,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';

export default function Index({ treatments, filters }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get('/treatments', {
                search: search || undefined,
                status: status || undefined,
            }, { preserveState: true, replace: true });
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, status]);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this treatment?')) {
            router.delete(`/treatments/${id}`);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
    };

    const hasFilters = search || status;

    return (
        <AppLayout title="Treatments">
            <Head title="Treatments" />

            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>
                        Treatments
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mt: 0.3 }}>
                        Manage all clinic treatments and their prices
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    component={Link}
                    href="/treatments/create"
                    sx={{ borderRadius: 2.5 }}
                >
                    Add Treatment
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
                    placeholder="Search by name or description..."
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
                                {['Treatment Name', 'Description', 'Default Price', 'Duration', 'Status', 'Actions'].map(col => (
                                    <TableCell key={col} sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {col}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {treatments.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6, color: '#94a3b8', fontSize: '0.875rem' }}>
                                        {hasFilters ? 'No treatments match your search.' : 'No treatments found. Add your first one!'}
                                    </TableCell>
                                </TableRow>
                            )}
                            {treatments.data.map((treatment) => (
                                <TableRow
                                    key={treatment.id}
                                    sx={{ '&:hover': { bgcolor: '#f8fafc' }, transition: 'background .15s' }}
                                >
                                    {/* Name */}
                                    <TableCell>
                                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#0f172a' }}>
                                            {treatment.name}
                                        </Typography>
                                    </TableCell>

                                    {/* Description */}
                                    <TableCell sx={{ fontSize: '0.83rem', color: '#64748b', maxWidth: 250 }}>
                                        {treatment.description
                                            ? <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {treatment.description}
                                              </span>
                                            : <span style={{ color: '#94a3b8' }}>—</span>
                                        }
                                    </TableCell>

                                    {/* Price */}
                                    <TableCell sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                                        {treatment.default_price
                                            ? `₱${Number(treatment.default_price).toLocaleString('en-PH')}`
                                            : <span style={{ color: '#94a3b8' }}>—</span>
                                        }
                                    </TableCell>

                                    {/* Duration */}
                                    <TableCell sx={{ fontSize: '0.83rem', color: '#334155' }}>
                                        {treatment.duration_minutes} mins
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <Chip
                                            label={treatment.is_active ? 'Active' : 'Inactive'}
                                            color={treatment.is_active ? 'success' : 'default'}
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
                                                    href={`/treatments/${treatment.id}/edit`}
                                                    sx={{ color: '#0d9488', '&:hover': { bgcolor: '#ccfbf1' } }}
                                                >
                                                    <EditRoundedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDelete(treatment.id)}
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
                {treatments.last_page > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, p: 2, borderTop: '1px solid #f1f5f9' }}>
                        {treatments.links.map((link, i) => (
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