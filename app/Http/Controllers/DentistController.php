<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class DentistController extends Controller
{

    public function index(Request $request)
    {
        $query = User::role('Dentist')->orderBy('name');

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('specialization', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $dentists = $query->paginate(10)->withQueryString();

        return Inertia::render('Dentists/Index', [
            'dentists' => $dentists->through(fn($d) => [
                'id'                 => $d->id,
                'name'               => $d->name,
                'email'              => $d->email,
                'phone'              => $d->phone,
                'specialization'     => $d->specialization,
                'is_active'          => $d->is_active,
                'initials'           => $d->initials,
                'total_appointments' => Appointment::where('dentist_id', $d->id)->count(),
                'today_appointments' => Appointment::where('dentist_id', $d->id)->today()->count(),
            ]),
            'filters' => $request->only(['search', 'status']),
        ]);
    }
    
    public function create()
    {
        return Inertia::render('Dentists/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'email'          => 'required|email|unique:users,email',
            'password'       => 'required|string|min:8',
            'phone'          => 'nullable|string|max:20',
            'specialization' => 'nullable|string|max:255',
            'is_active'      => 'boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $dentist = User::create($validated);
        $dentist->assignRole('Dentist');

        return redirect()->route('dentists.index')
            ->with('success', 'Dentist added successfully.');
    }

    public function edit(User $dentist)
    {
        return Inertia::render('Dentists/Edit', [
            'dentist' => [
                'id'             => $dentist->id,
                'name'           => $dentist->name,
                'email'          => $dentist->email,
                'phone'          => $dentist->phone,
                'specialization' => $dentist->specialization,
                'is_active'      => $dentist->is_active,
            ],
        ]);
    }

    public function update(Request $request, User $dentist)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'email'          => 'required|email|unique:users,email,' . $dentist->id,
            'password'       => 'nullable|string|min:8',
            'phone'          => 'nullable|string|max:20',
            'specialization' => 'nullable|string|max:255',
            'is_active'      => 'boolean',
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $dentist->update($validated);

        return redirect()->route('dentists.index')
            ->with('success', 'Dentist updated successfully.');
    }

    public function destroy(User $dentist)
    {
        $dentist->delete();

        return back()->with('success', 'Dentist removed.');
    }
}