<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $query = Patient::orderBy('first_name');

        // Search by name, phone or patient no
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('patient_no', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by gender
        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $patients = $query->paginate(10)->withQueryString();

        return Inertia::render('Patients/Index', [
            'patients' => $patients->through(fn($p) => [
                'id'         => $p->id,
                'patient_no' => $p->patient_no,
                'full_name'  => $p->full_name,
                'initials'   => $p->initials,
                'gender'     => $p->gender,
                'age'        => $p->age,
                'phone'      => $p->phone,
                'email'      => $p->email,
                'city'       => $p->city,
                'is_active'  => $p->is_active,
            ]),
            'filters' => $request->only(['search', 'gender', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Patients/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'                => 'required|string|max:255',
            'middle_name'               => 'nullable|string|max:255',
            'last_name'                 => 'required|string|max:255',
            'gender'                    => 'required|in:male,female,other',
            'date_of_birth'             => 'required|date',
            'email'                     => 'nullable|email',
            'phone'                     => 'required|string|max:20',
            'barangay'                  => 'nullable|string|max:255',
            'city'                      => 'nullable|string|max:255',
            'province'                  => 'nullable|string|max:255',
            'emergency_contact_name'    => 'nullable|string|max:255',
            'emergency_contact_phone'   => 'nullable|string|max:20',
            'medical_history'           => 'nullable|string',
            'allergies'                 => 'nullable|string',
            'notes'                     => 'nullable|string',
        ]);

        Patient::create($validated);

        return redirect()->route('patients.index')
            ->with('success', 'Patient created successfully.');
    }

    public function show(Patient $patient)
    {
        return Inertia::render('Patients/Show', [
            'patient' => [
                'id'                      => $patient->id,
                'patient_no'              => $patient->patient_no,
                'full_name'               => $patient->full_name,
                'first_name'              => $patient->first_name,
                'middle_name'             => $patient->middle_name,
                'last_name'               => $patient->last_name,
                'initials'                => $patient->initials,
                'gender'                  => $patient->gender,
                'date_of_birth'           => $patient->date_of_birth->format('M d, Y'),
                'age'                     => $patient->age,
                'email'                   => $patient->email,
                'phone'                   => $patient->phone,
                'barangay'                => $patient->barangay,
                'city'                    => $patient->city,
                'province'                => $patient->province,
                'emergency_contact_name'  => $patient->emergency_contact_name,
                'emergency_contact_phone' => $patient->emergency_contact_phone,
                'medical_history'         => $patient->medical_history,
                'allergies'               => $patient->allergies,
                'notes'                   => $patient->notes,
                'is_active'               => $patient->is_active,
            ],
            'appointments' => $patient->appointments()
                ->with('dentist')
                ->orderBy('appointment_date', 'desc')
                ->get()
                ->map(fn($a) => [
                    'id'               => $a->id,
                    'appointment_no'   => $a->appointment_no,
                    'treatment_type'   => $a->treatment_type,
                    'appointment_date' => $a->appointment_date->format('M d, Y'),
                    'start_time'       => $a->start_time,
                    'dentist_name'     => $a->dentist->name,
                    'status'           => $a->status,
                    'estimated_cost'   => $a->estimated_cost,
                ]),
        ]);
    }

    public function destroy(Patient $patient)
    {
        $patient->delete();

        return back()->with('success', 'Patient deleted.');
    }

    public function edit(Patient $patient)
    {
        return Inertia::render('Patients/Edit', [
            'patient' => [
                'id'                      => $patient->id,
                'first_name'              => $patient->first_name,
                'middle_name'             => $patient->middle_name,
                'last_name'               => $patient->last_name,
                'gender'                  => $patient->gender,
                'date_of_birth'           => $patient->date_of_birth->format('Y-m-d'),
                'email'                   => $patient->email,
                'phone'                   => $patient->phone,
                'barangay'                => $patient->barangay,
                'city'                    => $patient->city,
                'province'                => $patient->province,
                'emergency_contact_name'  => $patient->emergency_contact_name,
                'emergency_contact_phone' => $patient->emergency_contact_phone,
                'medical_history'         => $patient->medical_history,
                'allergies'               => $patient->allergies,
                'notes'                   => $patient->notes,
            ],
        ]);
    }

    public function update(Request $request, Patient $patient)
    {
        $validated = $request->validate([
            'first_name'                => 'required|string|max:255',
            'middle_name'               => 'nullable|string|max:255',
            'last_name'                 => 'required|string|max:255',
            'gender'                    => 'required|in:male,female,other',
            'date_of_birth'             => 'required|date',
            'email'                     => 'nullable|email',
            'phone'                     => 'required|string|max:20',
            'barangay'                  => 'nullable|string|max:255',
            'city'                      => 'nullable|string|max:255',
            'province'                  => 'nullable|string|max:255',
            'emergency_contact_name'    => 'nullable|string|max:255',
            'emergency_contact_phone'   => 'nullable|string|max:20',
            'medical_history'           => 'nullable|string',
            'allergies'                 => 'nullable|string',
            'notes'                     => 'nullable|string',
        ]);

        $patient->update($validated);

        return redirect()->route('patients.show', $patient)
            ->with('success', 'Patient updated successfully.');
    }

}