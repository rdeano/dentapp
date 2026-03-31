import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Box, Button, TextField, Typography,
    Grid, Divider, CircularProgress, Avatar,
} from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

export default function Edit({ user }) {
    // Profile form
    const {
        data: profileData,
        setData: setProfileData,
        patch: patchProfile,
        processing: profileProcessing,
        errors: profileErrors,
    } = useForm({
        name:  user.name,
        email: user.email,
        phone: user.phone ?? '',
    });

    // Password form
    const {
        data: passwordData,
        setData: setPasswordData,
        patch: patchPassword,
        processing: passwordProcessing,
        errors: passwordErrors,
        reset: resetPassword,
    } = useForm({
        current_password: '',
        password:         '',
        password_confirmation: '',
    });

    const submitProfile = (e) => {
        e.preventDefault();
        patchProfile('/profile');
    };

    const submitPassword = (e) => {
        e.preventDefault();
        patchPassword('/profile/password', {
            onSuccess: () => resetPassword(),
        });
    };

    const initials = user.name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <AppLayout title="Profile & Settings">
            <Head title="Profile & Settings" />

            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>
                    Profile & Settings
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mt: 0.3 }}>
                    Manage your account information and password
                </Typography>
            </Box>

            <Grid container spacing={2.5}>

                {/* Left — Avatar Card */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 3, textAlign: 'center' }}>
                        <Avatar sx={{
                            width: 80, height: 80, mx: 'auto', mb: 2,
                            bgcolor: '#0d9488', fontSize: '1.6rem', fontWeight: 700,
                        }}>
                            {initials}
                        </Avatar>
                        <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>
                            {user.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: '#64748b', mt: 0.3 }}>
                            {user.email}
                        </Typography>
                        <Box sx={{
                            mt: 1.5, px: 1.5, py: 0.5,
                            bgcolor: '#ccfbf1', color: '#0f766e',
                            borderRadius: 2, fontSize: '0.75rem',
                            fontWeight: 600, display: 'inline-block',
                        }}>
                            Admin
                        </Box>
                    </Box>
                </Grid>

                {/* Right — Forms */}
                <Grid size={{ xs: 12, md: 9 }}>

                    {/* Profile Information */}
                    <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 3, mb: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <PersonRoundedIcon sx={{ fontSize: 18, color: '#0d9488' }} />
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                                Personal Information
                            </Typography>
                        </Box>
                        <form onSubmit={submitProfile}>
                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        value={profileData.name}
                                        onChange={e => setProfileData('name', e.target.value)}
                                        error={!!profileErrors.name}
                                        helperText={profileErrors.name}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        type="email"
                                        value={profileData.email}
                                        onChange={e => setProfileData('email', e.target.value)}
                                        error={!!profileErrors.email}
                                        helperText={profileErrors.email}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        placeholder="09xx-xxx-xxxx"
                                        value={profileData.phone}
                                        onChange={e => setProfileData('phone', e.target.value)}
                                        error={!!profileErrors.phone}
                                        helperText={profileErrors.phone}
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2.5 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={profileProcessing}
                                    startIcon={profileProcessing ? <CircularProgress size={16} color="inherit" /> : <SaveRoundedIcon />}
                                    sx={{ borderRadius: 2.5, px: 3 }}
                                >
                                    Save Changes
                                </Button>
                            </Box>
                        </form>
                    </Box>

                    {/* Change Password */}
                    <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <LockRoundedIcon sx={{ fontSize: 18, color: '#0d9488' }} />
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                                Change Password
                            </Typography>
                        </Box>
                        <form onSubmit={submitPassword}>
                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Current Password"
                                        type="password"
                                        value={passwordData.current_password}
                                        onChange={e => setPasswordData('current_password', e.target.value)}
                                        error={!!passwordErrors.current_password}
                                        helperText={passwordErrors.current_password}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Divider />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        type="password"
                                        placeholder="Min. 8 characters"
                                        value={passwordData.password}
                                        onChange={e => setPasswordData('password', e.target.value)}
                                        error={!!passwordErrors.password}
                                        helperText={passwordErrors.password}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Confirm New Password"
                                        type="password"
                                        value={passwordData.password_confirmation}
                                        onChange={e => setPasswordData('password_confirmation', e.target.value)}
                                        error={!!passwordErrors.password_confirmation}
                                        helperText={passwordErrors.password_confirmation}
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2.5 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={passwordProcessing}
                                    startIcon={passwordProcessing ? <CircularProgress size={16} color="inherit" /> : <LockRoundedIcon />}
                                    sx={{ borderRadius: 2.5, px: 3 }}
                                >
                                    Update Password
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Grid>
            </Grid>
        </AppLayout>
    );
}