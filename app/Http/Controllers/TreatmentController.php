<?php

namespace App\Http\Controllers;

use App\Models\Treatment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TreatmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Treatment::orderBy('name');

        // Search by name
        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                ->orWhere('description', 'like', "%{$request->search}%");
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $treatments = $query->paginate(10)->withQueryString();

        return Inertia::render('Treatments/Index', [
            'treatments' => $treatments->through(fn($t) => [
                'id'               => $t->id,
                'name'             => $t->name,
                'description'      => $t->description,
                'default_price'    => $t->default_price,
                'duration_minutes' => $t->duration_minutes,
                'is_active'        => $t->is_active,
            ]),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Treatments/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255|unique:treatments,name',
            'description'      => 'nullable|string',
            'default_price'    => 'nullable|numeric|min:0',
            'duration_minutes' => 'required|integer|min:5',
            'is_active'        => 'boolean',
        ]);

        Treatment::create($validated);

        return redirect()->route('treatments.index')
            ->with('success', 'Treatment added successfully.');
    }

    public function edit(Treatment $treatment)
    {
        return Inertia::render('Treatments/Edit', [
            'treatment' => [
                'id'               => $treatment->id,
                'name'             => $treatment->name,
                'description'      => $treatment->description,
                'default_price'    => $treatment->default_price,
                'duration_minutes' => $treatment->duration_minutes,
                'is_active'        => $treatment->is_active,
            ],
        ]);
    }

    public function update(Request $request, Treatment $treatment)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255|unique:treatments,name,' . $treatment->id,
            'description'      => 'nullable|string',
            'default_price'    => 'nullable|numeric|min:0',
            'duration_minutes' => 'required|integer|min:5',
            'is_active'        => 'boolean',
        ]);

        $treatment->update($validated);

        return redirect()->route('treatments.index')
            ->with('success', 'Treatment updated successfully.');
    }

    public function destroy(Treatment $treatment)
    {
        $treatment->delete();

        return back()->with('success', 'Treatment deleted.');
    }
}