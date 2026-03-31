import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState } from 'react';
import {
    Box, Grid, Typography, TextField, MenuItem,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow,
} from '@mui/material';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';

const MONTHS = [
    { value: 1,  label: 'January' },
    { value: 2,  label: 'February' },
    { value: 3,  label: 'March' },
    { value: 4,  label: 'April' },
    { value: 5,  label: 'May' },
    { value: 6,  label: 'June' },
    { value: 7,  label: 'July' },
    { value: 8,  label: 'August' },
    { value: 9,  label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
];

const METHOD_LABELS = {
    cash:          'Cash',
    gcash:         'GCash',
    maya:          'Maya',
    bank_transfer: 'Bank Transfer',
    credit_card:   'Credit Card',
};

const METHOD_COLORS = {
    cash:          { bg: '#d1fae5', color: '#065f46' },
    gcash:         { bg: '#dbeafe', color: '#1e40af' },
    maya:          { bg: '#ede9fe', color: '#5b21b6' },
    bank_transfer: { bg: '#fef3c7', color: '#92400e' },
    credit_card:   { bg: '#fce7f3', color: '#9d174d' },
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
                width: 48, height: 48, borderRadius: 2.5,
                bgcolor: iconBg, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
            }}>
                <Box sx={{ color: iconColor, '& svg': { fontSize: 22 } }}>
                    {icon}
                </Box>
            </Box>
            <Box>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>
                    {prefix}{typeof value === 'number' ? value.toLocaleString('en-PH') : value}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#64748b', mt: 0.3 }}>
                    {label}
                </Typography>
            </Box>
        </Box>
    );
}

export default function Index({ summary, monthlyRevenue, monthlyAppointments, topTreatments, paymentMethods, filters, years }) {
    const [year, setYear]   = useState(filters.year);
    const [month, setMonth] = useState(filters.month);

    const handleFilter = (newYear, newMonth) => {
        router.get('/reports', {
            year:  newYear,
            month: newMonth,
        }, { preserveState: true, replace: true });
    };

    const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 1);
    const maxAppointments = Math.max(...monthlyAppointments.map(m => m.total), 1);

    return (
        <AppLayout title="Reports">
            <Head title="Reports" />

            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>
                        Reports
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mt: 0.3 }}>
                        Overview of clinic performance
                    </Typography>
                </Box>

                {/* Filters */}
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <TextField
                        select
                        size="small"
                        label="Month"
                        value={month}
                        onChange={e => {
                            setMonth(e.target.value);
                            handleFilter(year, e.target.value);
                        }}
                        sx={{ minWidth: 130 }}
                        SelectProps={{ sx: { borderRadius: 2, fontSize: '0.83rem' } }}
                    >
                        {MONTHS.map(m => (
                            <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        size="small"
                        label="Year"
                        value={year}
                        onChange={e => {
                            setYear(e.target.value);
                            handleFilter(e.target.value, month);
                        }}
                        sx={{ minWidth: 100 }}
                        SelectProps={{ sx: { borderRadius: 2, fontSize: '0.83rem' } }}
                    >
                        {years.map(y => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        icon={<TrendingUpRoundedIcon />}
                        value={Number(summary.total_revenue_month)}
                        label="Revenue this month"
                        iconBg="#ccfbf1" iconColor="#0d9488"
                        prefix="₱"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        icon={<TrendingUpRoundedIcon />}
                        value={Number(summary.total_revenue_year)}
                        label={`Total revenue ${year}`}
                        iconBg="#d1fae5" iconColor="#10b981"
                        prefix="₱"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        icon={<CalendarMonthRoundedIcon />}
                        value={summary.total_appointments_month}
                        label="Appointments this month"
                        iconBg="#dbeafe" iconColor="#3b82f6"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        icon={<PersonAddRoundedIcon />}
                        value={summary.new_patients_month}
                        label="New patients this month"
                        iconBg="#fef3c7" iconColor="#f59e0b"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2.5}>

                {/* Monthly Revenue Chart */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 2.5 }}>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 2.5 }}>
                            Monthly Revenue — {year}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 180 }}>
                            {monthlyRevenue.map((m, i) => (
                                <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                    <Typography sx={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 500 }}>
                                        {m.revenue > 0 ? `₱${(m.revenue / 1000).toFixed(0)}k` : ''}
                                    </Typography>
                                    <Box sx={{
                                        width: '100%',
                                        height: `${Math.max((m.revenue / maxRevenue) * 140, m.revenue > 0 ? 4 : 0)}px`,
                                        bgcolor: filters.month === i + 1 ? '#0d9488' : '#ccfbf1',
                                        borderRadius: '4px 4px 0 0',
                                        transition: 'height .3s ease',
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: '#0d9488' },
                                    }} />
                                    <Typography sx={{ fontSize: '0.62rem', color: '#94a3b8' }}>
                                        {m.month}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Grid>

                {/* Monthly Appointments Chart */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 2.5 }}>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 2.5 }}>
                            Monthly Appointments — {year}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 180 }}>
                            {monthlyAppointments.map((m, i) => (
                                <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                    <Typography sx={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 500 }}>
                                        {m.total > 0 ? m.total : ''}
                                    </Typography>
                                    <Box sx={{
                                        width: '100%',
                                        height: `${Math.max((m.total / maxAppointments) * 140, m.total > 0 ? 4 : 0)}px`,
                                        bgcolor: filters.month === i + 1 ? '#3b82f6' : '#dbeafe',
                                        borderRadius: '4px 4px 0 0',
                                        transition: 'height .3s ease',
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: '#3b82f6' },
                                    }} />
                                    <Typography sx={{ fontSize: '0.62rem', color: '#94a3b8' }}>
                                        {m.month}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Grid>

                {/* Top Treatments */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #f1f5f9' }}>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                                Top Treatments — {MONTHS.find(m => m.value === filters.month)?.label}
                            </Typography>
                        </Box>
                        {topTreatments.length === 0 ? (
                            <Box sx={{ py: 4, textAlign: 'center' }}>
                                <Typography sx={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                                    No data for this month.
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ p: 2.5 }}>
                                {topTreatments.map((t, i) => {
                                    const max = topTreatments[0].total;
                                    return (
                                        <Box key={i} sx={{ mb: 1.5 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography sx={{ fontSize: '0.8rem', color: '#334155', fontWeight: 500 }}>
                                                    {t.treatment}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                    {t.total} appointments
                                                </Typography>
                                            </Box>
                                            <Box sx={{ bgcolor: '#f1f5f9', borderRadius: 2, height: 8, overflow: 'hidden' }}>
                                                <Box sx={{
                                                    height: '100%',
                                                    width: `${(t.total / max) * 100}%`,
                                                    bgcolor: '#0d9488',
                                                    borderRadius: 2,
                                                    transition: 'width .5s ease',
                                                }} />
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        )}
                    </Box>
                </Grid>

                {/* Payment Methods */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #f1f5f9' }}>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                                Payment Methods — {MONTHS.find(m => m.value === filters.month)?.label}
                            </Typography>
                        </Box>
                        {paymentMethods.length === 0 ? (
                            <Box sx={{ py: 4, textAlign: 'center' }}>
                                <Typography sx={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                                    No payments recorded this month.
                                </Typography>
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                            {['Method', 'Transactions', 'Revenue'].map(col => (
                                                <TableCell key={col} sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    {col}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paymentMethods.map((p, i) => (
                                            <TableRow key={i} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                                <TableCell>
                                                    <Box sx={{
                                                        display: 'inline-flex',
                                                        px: 1.2, py: 0.3,
                                                        borderRadius: 1.5,
                                                        bgcolor: METHOD_COLORS[p.method]?.bg ?? '#f1f5f9',
                                                        color: METHOD_COLORS[p.method]?.color ?? '#475569',
                                                        fontSize: '0.72rem',
                                                        fontWeight: 600,
                                                    }}>
                                                        {METHOD_LABELS[p.method] ?? p.method}
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ fontSize: '0.83rem', color: '#334155' }}>
                                                    {p.total}
                                                </TableCell>
                                                <TableCell sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                                                    ₱{Number(p.revenue).toLocaleString('en-PH')}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </AppLayout>
    );
}