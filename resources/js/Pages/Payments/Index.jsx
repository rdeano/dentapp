import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState, useEffect } from 'react';
import {
    Box, Button, Typography, Avatar, Chip,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Tooltip, Grid,
    TextField, MenuItem, InputAdornment,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import PendingRoundedIcon from '@mui/icons-material/PendingRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';

const AVATAR_COLORS = [
    '#0d9488','#3b82f6','#8b5cf6','#f59e0b',
    '#ef4444','#10b981','#0891b2','#6366f1',
];

const hashColor = (str = '') =>
    AVATAR_COLORS[str.charCodeAt(0) % AVATAR_COLORS.length];

const METHOD_COLORS = {
    cash:          { bg: '#d1fae5', color: '#065f46' },
    gcash:         { bg: '#dbeafe', color: '#1e40af' },
    maya:          { bg: '#ede9fe', color: '#5b21b6' },
    bank_transfer: { bg: '#fef3c7', color: '#92400e' },
    credit_card:   { bg: '#fce7f3', color: '#9d174d' },
};

function SummaryCard({ icon, label, value, iconBg, iconColor }) {
    return (
        <Box sx={{
            bgcolor: 'white', borderRadius: 3,
            border: '1px solid #e2e8f0', p: 2.5,
            display: 'flex', alignItems: 'center', gap: 2,
            transition: 'box-shadow .2s',
            '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.06)' },
        }}>
            <Box sx={{
                width: 46, height: 46, borderRadius: 2.5,
                bgcolor: iconBg, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
            }}>
                <Box sx={{ color: iconColor, '& svg': { fontSize: 20 } }}>
                    {icon}
                </Box>
            </Box>
            <Box>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>
                    ₱{Number(value).toLocaleString('en-PH')}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mt: 0.3 }}>
                    {label}
                </Typography>
            </Box>
        </Box>
    );
}

export default function Index({ payments, summary, filters }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [method, setMethod] = useState(filters.method ?? '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get('/payments', {
                search: search || undefined,
                status: status || undefined,
                method: method || undefined,
            }, { preserveState: true, replace: true });
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, status, method]);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this payment record?')) {
            router.delete(`/payments/${id}`);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        setMethod('');
    };

    const hasFilters = search || status || method;

    return (
        <AppLayout title="Payments">
            <Head title="Payments" />

            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>
                        Payments
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mt: 0.3 }}>
                        Track and manage all clinic payments
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    component={Link}
                    href="/payments/create"
                    sx={{ borderRadius: 2.5 }}
                >
                    Record Payment
                </Button>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <SummaryCard
                        icon={<TrendingUpRoundedIcon />}
                        label="Revenue this month"
                        value={summary.this_month}
                        iconBg="#ccfbf1" iconColor="#0d9488"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <SummaryCard
                        icon={<PaidRoundedIcon />}
                        label="Total paid"
                        value={summary.total_paid}
                        iconBg="#d1fae5" iconColor="#10b981"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <SummaryCard
                        icon={<PendingRoundedIcon />}
                        label="Total unpaid"
                        value={summary.total_unpaid}
                        iconBg="#fee2e2" iconColor="#ef4444"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <SummaryCard
                        icon={<AccountBalanceWalletRoundedIcon />}
                        label="Total partial"
                        value={summary.total_partial}
                        iconBg="#fef3c7" iconColor="#f59e0b"
                    />
                </Grid>
            </Grid>

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
                    placeholder="Search patient or payment no..."
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
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="unpaid">Unpaid</MenuItem>
                    <MenuItem value="partial">Partial</MenuItem>
                </TextField>

                {/* Method Filter */}
                <TextField
                    select
                    size="small"
                    label="Method"
                    value={method}
                    onChange={e => setMethod(e.target.value)}
                    sx={{ minWidth: 150 }}
                    SelectProps={{ sx: { borderRadius: 2, fontSize: '0.83rem' } }}
                >
                    <MenuItem value="">All Methods</MenuItem>
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="gcash">GCash</MenuItem>
                    <MenuItem value="maya">Maya</MenuItem>
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                    <MenuItem value="credit_card">Credit Card</MenuItem>
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
                                {['Payment No.', 'Patient', 'Treatment', 'Amount', 'Method', 'Date', 'Status', 'Actions'].map(col => (
                                    <TableCell key={col} sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {col}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payments.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6, color: '#94a3b8', fontSize: '0.875rem' }}>
                                        {hasFilters ? 'No payments match your search.' : 'No payment records yet.'}
                                    </TableCell>
                                </TableRow>
                            )}
                            {payments.data.map((payment) => (
                                <TableRow
                                    key={payment.id}
                                    sx={{ '&:hover': { bgcolor: '#f8fafc' }, transition: 'background .15s' }}
                                >
                                    {/* Payment No */}
                                    <TableCell sx={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'monospace' }}>
                                        {payment.payment_no}
                                    </TableCell>

                                    {/* Patient */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                            <Avatar sx={{
                                                width: 30, height: 30,
                                                bgcolor: hashColor(payment.patient_initials),
                                                fontSize: '0.68rem', fontWeight: 600,
                                            }}>
                                                {payment.patient_initials}
                                            </Avatar>
                                            <Typography sx={{ fontSize: '0.83rem', fontWeight: 500, color: '#0f172a' }}>
                                                {payment.patient_name}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    {/* Treatment */}
                                    <TableCell sx={{ fontSize: '0.83rem', color: '#334155' }}>
                                        {payment.treatment_type ?? <span style={{ color: '#94a3b8' }}>—</span>}
                                    </TableCell>

                                    {/* Amount */}
                                    <TableCell sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                                        ₱{Number(payment.amount).toLocaleString('en-PH')}
                                    </TableCell>

                                    {/* Method */}
                                    <TableCell>
                                        <Box sx={{
                                            display: 'inline-flex',
                                            px: 1.2, py: 0.3,
                                            borderRadius: 1.5,
                                            bgcolor: METHOD_COLORS[payment.payment_method]?.bg ?? '#f1f5f9',
                                            color: METHOD_COLORS[payment.payment_method]?.color ?? '#475569',
                                            fontSize: '0.72rem',
                                            fontWeight: 600,
                                        }}>
                                            {payment.method_label}
                                        </Box>
                                    </TableCell>

                                    {/* Date */}
                                    <TableCell sx={{ fontSize: '0.83rem', color: '#334155' }}>
                                        {payment.payment_date ?? <span style={{ color: '#94a3b8' }}>—</span>}
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <Chip
                                            label={payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                            color={payment.status_color}
                                            size="small"
                                            sx={{ height: 22, fontSize: '0.7rem' }}
                                        />
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell>
                                        <Tooltip title="Print Receipt">
                                            <IconButton
                                                size="small"
                                                onClick={() => window.open(`/payments/${payment.id}/receipt`, '_blank')}
                                                sx={{ color: '#8b5cf6', '&:hover': { bgcolor: '#ede9fe' } }}
                                            >
                                                <ReceiptRoundedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Edit">
                                            <IconButton
                                                size="small"
                                                component={Link}
                                                href={`/payments/${payment.id}/edit`}
                                                sx={{ color: '#0d9488', '&:hover': { bgcolor: '#ccfbf1' } }}
                                            >
                                                <EditRoundedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(payment.id)}
                                                sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}
                                            >
                                                <DeleteRoundedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                {payments.last_page > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, p: 2, borderTop: '1px solid #f1f5f9' }}>
                        {payments.links.map((link, i) => (
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