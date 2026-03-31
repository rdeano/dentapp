<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TreatmentController;
use App\Http\Controllers\DentistController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ProfileController;

Route::get('/', function () {
    return redirect()->route('login');
});

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

// Auth routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    // accessible by all authenticated users
    Route::middleware('role:Admin|Receptionist')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->name('dashboard');


        Route::get('/appointments/calendar', [AppointmentController::class, 'calendar'])
            ->name('appointments.calendar');

        // Appointments
        Route::get('/appointments', [AppointmentController::class, 'index'])
            ->name('appointments.index');
        Route::get('/appointments/create', [AppointmentController::class, 'create'])
            ->name('appointments.create');
        Route::post('/appointments', [AppointmentController::class, 'store'])
            ->name('appointments.store');
        Route::get('/appointments/{appointment}/edit', [AppointmentController::class, 'edit'])
            ->name('appointments.edit');
        Route::put('/appointments/{appointment}', [AppointmentController::class, 'update'])
            ->name('appointments.update');
        Route::patch('/appointments/{appointment}/status', [AppointmentController::class, 'updateStatus'])
            ->name('appointments.updateStatus');
        Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy'])
            ->name('appointments.destroy');

        // Patients
        Route::get('/patients', [PatientController::class, 'index'])
            ->name('patients.index');
        Route::get('/patients/create', [PatientController::class, 'create'])
            ->name('patients.create');
        Route::post('/patients', [PatientController::class, 'store'])
            ->name('patients.store');
        Route::get('/patients/{patient}', [PatientController::class, 'show'])
            ->name('patients.show');
        Route::get('/patients/{patient}/edit', [PatientController::class, 'edit'])
            ->name('patients.edit');
        Route::put('/patients/{patient}', [PatientController::class, 'update'])
            ->name('patients.update');
        Route::delete('/patients/{patient}', [PatientController::class, 'destroy'])
            ->name('patients.destroy');

        // Payments
        Route::get('/payments', [PaymentController::class, 'index'])
            ->name('payments.index');
        Route::get('/payments/create', [PaymentController::class, 'create'])
            ->name('payments.create');
        Route::post('/payments', [PaymentController::class, 'store'])
            ->name('payments.store');
        Route::get('/payments/{payment}/edit', [PaymentController::class, 'edit'])
            ->name('payments.edit');
        Route::put('/payments/{payment}', [PaymentController::class, 'update'])
            ->name('payments.update');
        Route::delete('/payments/{payment}', [PaymentController::class, 'destroy'])
            ->name('payments.destroy');
        Route::get('/payments/{payment}/receipt', [PaymentController::class, 'show'])
            ->name('payments.receipt');

            
        // Profile
        Route::get('/profile', [ProfileController::class, 'edit'])
            ->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])
            ->name('profile.update');
        Route::patch('/profile/password', [ProfileController::class, 'updatePassword'])
            ->name('profile.password');

    });

    // Admin only
    Route::middleware('role:Admin')->group(function () {
        // Treatments
        Route::get('/treatments', [TreatmentController::class, 'index'])
            ->name('treatments.index');
        Route::get('/treatments/create', [TreatmentController::class, 'create'])
            ->name('treatments.create');
        Route::post('/treatments', [TreatmentController::class, 'store'])
            ->name('treatments.store');
        Route::get('/treatments/{treatment}/edit', [TreatmentController::class, 'edit'])
            ->name('treatments.edit');
        Route::put('/treatments/{treatment}', [TreatmentController::class, 'update'])
            ->name('treatments.update');
        Route::delete('/treatments/{treatment}', [TreatmentController::class, 'destroy'])
            ->name('treatments.destroy');

        // Dentists
        Route::get('/dentists', [DentistController::class, 'index'])
            ->name('dentists.index');
        Route::get('/dentists/create', [DentistController::class, 'create'])
            ->name('dentists.create');
        Route::post('/dentists', [DentistController::class, 'store'])
            ->name('dentists.store');
        Route::get('/dentists/{dentist}/edit', [DentistController::class, 'edit'])
            ->name('dentists.edit');
        Route::put('/dentists/{dentist}', [DentistController::class, 'update'])
            ->name('dentists.update');
        Route::delete('/dentists/{dentist}', [DentistController::class, 'destroy'])
            ->name('dentists.destroy');

        // Reports
        Route::get('/reports', [ReportController::class, 'index'])
            ->name('reports.index');

    });
});