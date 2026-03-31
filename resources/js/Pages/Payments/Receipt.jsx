import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded';

const METHOD_LABELS = {
    cash:          'Cash',
    gcash:         'GCash',
    maya:          'Maya',
    bank_transfer: 'Bank Transfer',
    credit_card:   'Credit Card',
};

const STATUS_COLORS = {
    paid:    { bg: '#d1fae5', color: '#065f46' },
    unpaid:  { bg: '#fee2e2', color: '#991b1b' },
    partial: { bg: '#fef3c7', color: '#92400e' },
};

function ReceiptRow({ label, value }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
            <Typography sx={{ fontSize: '0.78rem', color: '#64748b' }}>
                {label}
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 500, color: '#0f172a', textAlign: 'right', maxWidth: '60%' }}>
                {value ?? '—'}
            </Typography>
        </Box>
    );
}

export default function Receipt({ payment }) {
    useEffect(() => {
        const timeout = setTimeout(() => {
            window.print();
        }, 800);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
            <Head title={`Receipt ${payment.payment_no}`} />

            <style>{`
                * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                @media print {
                    @page { margin: 0; size: A5 portrait; }
                    html, body { margin: 0 !important; padding: 0 !important; background: white !important; height: auto !important; }
                    .no-print { display: none !important; }
                    .receipt-wrapper { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
                    .receipt-box { border: none !important; border-radius: 0 !important; box-shadow: none !important; }
                }
            `}</style>

            {/* Print Button Bar */}
            <Box className="no-print" sx={{
                display: 'flex', justifyContent: 'center',
                gap: 1.5, p: 2, bgcolor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                position: 'sticky', top: 0, zIndex: 10,
            }}>
                <Button
                    variant="contained"
                    startIcon={<PrintRoundedIcon />}
                    onClick={() => window.print()}
                    sx={{ borderRadius: 2.5 }}
                >
                    Print Receipt
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => window.close()}
                    sx={{ borderRadius: 2.5, color: '#64748b' }}
                >
                    Close
                </Button>
            </Box>

            {/* Receipt Wrapper */}
            <Box className="receipt-wrapper" sx={{
                maxWidth: 480, mx: 'auto', my: 3, px: 2,
            }}>
                <Box className="receipt-box" sx={{
                    bgcolor: 'white',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                }}>

                    {/* Header */}
                    <Box className="receipt-header" sx={{
                        background: 'linear-gradient(135deg, #0f766e, #0891b2)',
                        p: 2, textAlign: 'center',
                    }}>
                        <Box sx={{
                            width: 36, height: 36, borderRadius: 2,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', mx: 'auto', mb: 1,
                        }}>
                            <MedicalServicesRoundedIcon sx={{ color: 'white', fontSize: 18 }} />
                        </Box>
                        <Typography sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.2rem', fontWeight: 600, color: 'white',
                        }}>
                            DentApp
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)', mt: 0.2 }}>
                            Dental Clinic Management System
                        </Typography>
                    </Box>

                    {/* Receipt No & Status */}
                    <Box sx={{
                        px: 2.5, py: 1.5,
                        bgcolor: '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <Box>
                            <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Official Receipt
                            </Typography>
                            <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
                                {payment.payment_no}
                            </Typography>
                        </Box>
                        <Box sx={{
                            px: 1.2, py: 0.4,
                            borderRadius: 2,
                            bgcolor: STATUS_COLORS[payment.status]?.bg ?? '#f1f5f9',
                            color: STATUS_COLORS[payment.status]?.color ?? '#475569',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}>
                            {payment.status}
                        </Box>
                    </Box>

                    {/* Body */}
                    <Box sx={{ px: 2.5, py: 1.5 }}>

                        {/* Patient Info */}
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 0.5 }}>
                            Patient Information
                        </Typography>
                        <ReceiptRow label="Name"    value={payment.patient_name} />
                        <ReceiptRow label="Phone"   value={payment.patient_phone} />
                        <ReceiptRow label="Address" value={payment.patient_address || '—'} />

                        <Divider sx={{ my: 1.2, borderColor: '#f1f5f9' }} />

                        {/* Treatment Info */}
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 0.5 }}>
                            Treatment Details
                        </Typography>
                        <ReceiptRow label="Appointment No." value={payment.appointment_no} />
                        <ReceiptRow label="Treatment"       value={payment.treatment_type} />
                        <ReceiptRow label="Dentist"         value={payment.dentist_name} />

                        <Divider sx={{ my: 1.2, borderColor: '#f1f5f9' }} />

                        {/* Payment Info */}
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 0.5 }}>
                            Payment Details
                        </Typography>
                        <ReceiptRow label="Payment Date"   value={payment.payment_date} />
                        <ReceiptRow label="Payment Method" value={METHOD_LABELS[payment.payment_method] ?? payment.payment_method} />
                        {payment.notes && (
                            <ReceiptRow label="Notes" value={payment.notes} />
                        )}

                        <Divider sx={{ my: 1.2, borderColor: '#f1f5f9' }} />

                        {/* Total Amount */}
                        <Box className="receipt-total" sx={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center',
                            bgcolor: '#f0fdfa',
                            borderRadius: 2,
                            px: 2, py: 1.2,
                            border: '1px solid #ccfbf1',
                        }}>
                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>
                                Total Amount
                            </Typography>
                            <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: '#0d9488' }}>
                                ₱{Number(payment.amount).toLocaleString('en-PH')}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Footer */}
                    <Box sx={{
                        px: 2.5, py: 1.2,
                        bgcolor: '#f8fafc',
                        borderTop: '1px solid #e2e8f0',
                        textAlign: 'center',
                    }}>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                            Thank you for trusting DentApp Dental Clinic! 🦷
                        </Typography>
                        <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8', mt: 0.3 }}>
                            Issued: {payment.created_at}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </>
    );
}