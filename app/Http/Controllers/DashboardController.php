<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Today's appointments
        $todayAppointments = Appointment::with(['patient', 'dentist'])
            ->today()
            ->orderBy('start_time')
            ->get()
            ->map(fn($a) => [
                'id'               => $a->id,
                'appointment_no'   => $a->appointment_no,
                'patient_name'     => $a->patient->full_name,
                'patient_initials' => $a->patient->initials,
                'dentist_name'     => $a->dentist->name,
                'treatment_type'   => $a->treatment_type,
                'start_time'       => $a->start_time,
                'end_time'         => $a->end_time,
                'status'           => $a->status,
            ]);

        // Upcoming appointments (next 5 excluding today)
        $upcoming = Appointment::with(['patient', 'dentist'])
            ->whereDate('appointment_date', '>', today())
            ->orderBy('appointment_date')
            ->orderBy('start_time')
            ->limit(5)
            ->get()
            ->map(fn($a) => [
                'id'             => $a->id,
                'patient_name'   => $a->patient->full_name,
                'treatment_type' => $a->treatment_type,
                'date'           => $a->appointment_date->format('D, M j'),
                'start_time'     => $a->start_time,
                'dentist_name'   => $a->dentist->name,
            ]);

        // Stats
        $stats = [
            'today_total'    => Appointment::today()->count(),
            'total_patients' => Patient::where('is_active', true)->count(),
            'pending'        => Appointment::today()
                ->where('status', 'pending')
                ->count(),
            'completed'      => Appointment::today()
                ->where('status', 'completed')
                ->count(),
            'monthly_revenue' => Payment::where('status', 'paid')
                ->whereMonth('payment_date', now()->month)
                ->whereYear('payment_date', now()->year)
                ->sum('amount'),
        ];

        return Inertia::render('Dashboard/Index', [
            'stats'                => $stats,
            'todayAppointments'    => $todayAppointments,
            'upcomingAppointments' => $upcoming,
        ]);
    }
}