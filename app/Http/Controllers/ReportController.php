<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $year  = $request->get('year', now()->year);
        $month = $request->get('month', now()->month);

        // Monthly revenue per month for the whole year
        $monthlyRevenue = collect(range(1, 12))->map(fn($m) => [
            'month'   => date('M', mktime(0, 0, 0, $m, 1)),
            'revenue' => Payment::where('status', 'paid')
                ->whereYear('payment_date', $year)
                ->whereMonth('payment_date', $m)
                ->sum('amount'),
        ]);

        // Appointments per month for the whole year
        $monthlyAppointments = collect(range(1, 12))->map(fn($m) => [
            'month' => date('M', mktime(0, 0, 0, $m, 1)),
            'total' => Appointment::whereYear('appointment_date', $year)
                ->whereMonth('appointment_date', $m)
                ->count(),
        ]);

        // Top treatments this month
        $topTreatments = Appointment::whereYear('appointment_date', $year)
            ->whereMonth('appointment_date', $month)
            ->selectRaw('treatment_type, count(*) as total')
            ->groupBy('treatment_type')
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->map(fn($t) => [
                'treatment' => $t->treatment_type,
                'total'     => $t->total,
            ]);

        // Payment method breakdown this month
        $paymentMethods = Payment::where('status', 'paid')
            ->whereYear('payment_date', $year)
            ->whereMonth('payment_date', $month)
            ->selectRaw('payment_method, count(*) as total, sum(amount) as revenue')
            ->groupBy('payment_method')
            ->get()
            ->map(fn($p) => [
                'method'  => $p->payment_method,
                'total'   => $p->total,
                'revenue' => $p->revenue,
            ]);

        // Summary stats
        $summary = [
            'total_revenue_year'    => Payment::where('status', 'paid')
                ->whereYear('payment_date', $year)
                ->sum('amount'),
            'total_revenue_month'   => Payment::where('status', 'paid')
                ->whereYear('payment_date', $year)
                ->whereMonth('payment_date', $month)
                ->sum('amount'),
            'total_appointments_year'  => Appointment::whereYear('appointment_date', $year)->count(),
            'total_appointments_month' => Appointment::whereYear('appointment_date', $year)
                ->whereMonth('appointment_date', $month)
                ->count(),
            'new_patients_month'    => Patient::whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->count(),
            'total_patients'        => Patient::where('is_active', true)->count(),
        ];

        return Inertia::render('Reports/Index', [
            'summary'             => $summary,
            'monthlyRevenue'      => $monthlyRevenue,
            'monthlyAppointments' => $monthlyAppointments,
            'topTreatments'       => $topTreatments,
            'paymentMethods'      => $paymentMethods,
            'filters'             => [
                'year'  => (int) $year,
                'month' => (int) $month,
            ],
            'years' => range(now()->year, now()->year - 3),
        ]);
    }
}