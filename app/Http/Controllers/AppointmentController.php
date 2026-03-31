<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Appointment::with(['patient', 'dentist'])
            ->orderBy('appointment_date', 'desc')
            ->orderBy('start_time', 'desc');

        // Search by patient name or appointment no
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('appointment_no', 'like', "%{$search}%")
                ->orWhereHas('patient', function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                });
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date
        if ($request->filled('date')) {
            $query->whereDate('appointment_date', $request->date);
        }

        $appointments = $query->paginate(10)->withQueryString();

        return Inertia::render('Appointments/Index', [
            'appointments' => $appointments->through(fn($a) => [
                'id'               => $a->id,
                'appointment_no'   => $a->appointment_no,
                'patient_name'     => $a->patient->full_name,
                'patient_initials' => $a->patient->initials,
                'dentist_name'     => $a->dentist->name,
                'treatment_type'   => $a->treatment_type,
                'appointment_date' => $a->appointment_date->format('M d, Y'),
                'start_time'       => $a->start_time,
                'end_time'         => $a->end_time,
                'status'           => $a->status,
                'estimated_cost'   => $a->estimated_cost,
            ]),
            'filters' => $request->only(['search', 'status', 'date']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Appointments/Create', [
            'patients' => Patient::where('is_active', true)
                ->orderBy('first_name')
                ->get()
                ->map(fn($p) => [
                    'id'   => $p->id,
                    'name' => $p->full_name,
                    'no'   => $p->patient_no,
                ]),
            'dentists' => User::role('Dentist')
                ->where('is_active', true)
                ->get()
                ->map(fn($d) => [
                    'id'   => $d->id,
                    'name' => $d->name,
                ]),
            'treatments' => \App\Models\Treatment::where('is_active', true)
                ->orderBy('name')
                ->get()
                ->map(fn($t) => [
                    'id'            => $t->id,
                    'name'          => $t->name,
                    'default_price' => $t->default_price,
                    'duration_minutes' => $t->duration_minutes,
                ]),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id'       => 'required|exists:patients,id',
            'dentist_id'       => 'required|exists:users,id',
            'appointment_date' => 'required|date',
            'start_time'       => 'required',
            'end_time'         => 'required|after:start_time',
            'treatment_type'   => 'required|string',
            'chief_complaint'  => 'nullable|string',
            'notes'            => 'nullable|string',
            'estimated_cost'   => 'nullable|numeric|min:0',
            'status'           => 'required|in:pending,confirmed',
        ]);

        $validated['created_by'] = auth()->id();

        Appointment::create($validated);

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment created successfully.');
    }

    public function updateStatus(Request $request, Appointment $appointment)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,waiting,in_progress,completed,cancelled,no_show',
        ]);

        $appointment->update(['status' => $request->status]);

        return back()->with('success', 'Status updated.');
    }

    public function edit(Appointment $appointment)
    {
        return Inertia::render('Appointments/Edit', [
            'appointment' => [
                'id'               => $appointment->id,
                'patient_id'       => $appointment->patient_id,
                'dentist_id'       => $appointment->dentist_id,
                'appointment_date' => $appointment->appointment_date->format('Y-m-d'),
                'start_time'       => $appointment->start_time,
                'end_time'         => $appointment->end_time,
                'treatment_type'   => $appointment->treatment_type,
                'chief_complaint'  => $appointment->chief_complaint,
                'notes'            => $appointment->notes,
                'estimated_cost'   => $appointment->estimated_cost,
                'status'           => $appointment->status,
            ],
            'patients' => Patient::where('is_active', true)
                ->orderBy('first_name')
                ->get()
                ->map(fn($p) => [
                    'id'   => $p->id,
                    'name' => $p->full_name,
                    'no'   => $p->patient_no,
                ]),
            'dentists' => User::role('Dentist')
                ->where('is_active', true)
                ->get()
                ->map(fn($d) => [
                    'id'   => $d->id,
                    'name' => $d->name,
                ]),
            'treatments' => \App\Models\Treatment::where('is_active', true)
                ->orderBy('name')
                ->get()
                ->map(fn($t) => [
                    'id'               => $t->id,
                    'name'             => $t->name,
                    'default_price'    => $t->default_price,
                    'duration_minutes' => $t->duration_minutes,
                ]),
        ]);
    }

    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'patient_id'       => 'required|exists:patients,id',
            'dentist_id'       => 'required|exists:users,id',
            'appointment_date' => 'required|date',
            'start_time'       => 'required',
            'end_time'         => 'required|after:start_time',
            'treatment_type'   => 'required|string',
            'chief_complaint'  => 'nullable|string',
            'notes'            => 'nullable|string',
            'estimated_cost'   => 'nullable|numeric|min:0',
            'status'           => 'required|in:pending,confirmed,waiting,in_progress,completed,cancelled,no_show',
        ]);

        $appointment->update($validated);

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment updated successfully.');
    }


    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return back()->with('success', 'Appointment deleted.');
    }

     public function calendar()
    {
        $appointments = Appointment::with(['patient', 'dentist'])
            ->whereMonth('appointment_date', request('month', now()->month))
            ->whereYear('appointment_date', request('year', now()->year))
            ->get()
            ->map(fn($a) => [
                'id'    => $a->id,
                'title' => $a->patient->full_name . ' — ' . $a->treatment_type,
                'start' => $a->appointment_date->format('Y-m-d') . 'T' . $a->start_time,
                'end'   => $a->appointment_date->format('Y-m-d') . 'T' . $a->end_time,
                'extendedProps' => [
                    'patient_name'   => $a->patient->full_name,
                    'dentist_name'   => $a->dentist->name,
                    'treatment_type' => $a->treatment_type,
                    'status'         => $a->status,
                    'estimated_cost' => $a->estimated_cost,
                ],
                'backgroundColor' => match($a->status) {
                    'confirmed'   => '#0d9488',
                    'pending'     => '#f59e0b',
                    'in_progress' => '#3b82f6',
                    'completed'   => '#10b981',
                    'cancelled'   => '#ef4444',
                    'no_show'     => '#ef4444',
                    'waiting'     => '#0891b2',
                    default       => '#64748b',
                },
                'borderColor' => 'transparent',
            ]);

        return Inertia::render('Appointments/Calendar', [
            'appointments' => $appointments,
        ]);
    }
    
}