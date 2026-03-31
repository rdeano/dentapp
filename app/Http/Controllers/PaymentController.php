<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Patient;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['patient', 'appointment'])
            ->orderBy('created_at', 'desc');

        // Search by patient name or payment no
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('payment_no', 'like', "%{$search}%")
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

        // Filter by payment method
        if ($request->filled('method')) {
            $query->where('payment_method', $request->method);
        }

        $payments = $query->paginate(10)->withQueryString();

        return Inertia::render('Payments/Index', [
            'payments' => $payments->through(fn($p) => [
                'id'               => $p->id,
                'payment_no'       => $p->payment_no,
                'patient_name'     => $p->patient->full_name,
                'patient_initials' => $p->patient->initials,
                'appointment_no'   => $p->appointment?->appointment_no,
                'treatment_type'   => $p->appointment?->treatment_type,
                'amount'           => $p->amount,
                'payment_method'   => $p->payment_method,
                'method_label'     => $p->method_label,
                'status'           => $p->status,
                'status_color'     => $p->status_color,
                'payment_date'     => $p->payment_date?->format('M d, Y'),
                'notes'            => $p->notes,
            ]),
            'summary' => [
                'total_paid'    => Payment::where('status', 'paid')->sum('amount'),
                'total_unpaid'  => Payment::where('status', 'unpaid')->sum('amount'),
                'total_partial' => Payment::where('status', 'partial')->sum('amount'),
                'this_month'    => Payment::where('status', 'paid')
                    ->whereMonth('payment_date', now()->month)
                    ->whereYear('payment_date', now()->year)
                    ->sum('amount'),
            ],
            'filters' => $request->only(['search', 'status', 'method']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Payments/Create', [
            'patients' => Patient::where('is_active', true)
                ->orderBy('first_name')
                ->get()
                ->map(fn($p) => [
                    'id'   => $p->id,
                    'name' => $p->full_name,
                    'no'   => $p->patient_no,
                ]),
            'appointments' => Appointment::with('patient')
                ->whereIn('status', ['confirmed', 'completed', 'waiting', 'in_progress'])
                ->orderBy('appointment_date', 'desc')
                ->get()
                ->map(fn($a) => [
                    'id'             => $a->id,
                    'appointment_no' => $a->appointment_no,
                    'patient_id'     => $a->patient_id,
                    'patient_name'   => $a->patient->full_name,
                    'treatment_type' => $a->treatment_type,
                    'estimated_cost' => $a->estimated_cost,
                    'date'           => $a->appointment_date->format('M d, Y'),
                ]),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id'      => 'required|exists:patients,id',
            'appointment_id'  => 'nullable|exists:appointments,id',
            'amount'          => 'required|numeric|min:0',
            'payment_method'  => 'required|in:cash,gcash,maya,bank_transfer,credit_card',
            'status'          => 'required|in:paid,unpaid,partial',
            'payment_date'    => 'required|date',
            'notes'           => 'nullable|string',
        ]);

        $validated['created_by'] = auth()->id();

        Payment::create($validated);

        return redirect()->route('payments.index')
            ->with('success', 'Payment recorded successfully.');
    }

    public function edit(Payment $payment)
    {
        return Inertia::render('Payments/Edit', [
            'payment' => [
                'id'             => $payment->id,
                'patient_id'     => $payment->patient_id,
                'appointment_id' => $payment->appointment_id,
                'amount'         => $payment->amount,
                'payment_method' => $payment->payment_method,
                'status'         => $payment->status,
                'payment_date'   => $payment->payment_date?->format('Y-m-d'),
                'notes'          => $payment->notes,
            ],
            'patients' => Patient::where('is_active', true)
                ->orderBy('first_name')
                ->get()
                ->map(fn($p) => [
                    'id'   => $p->id,
                    'name' => $p->full_name,
                    'no'   => $p->patient_no,
                ]),
            'appointments' => Appointment::with('patient')
                ->whereIn('status', ['confirmed', 'completed', 'waiting', 'in_progress'])
                ->orderBy('appointment_date', 'desc')
                ->get()
                ->map(fn($a) => [
                    'id'             => $a->id,
                    'appointment_no' => $a->appointment_no,
                    'patient_id'     => $a->patient_id,
                    'patient_name'   => $a->patient->full_name,
                    'treatment_type' => $a->treatment_type,
                    'estimated_cost' => $a->estimated_cost,
                    'date'           => $a->appointment_date->format('M d, Y'),
                ]),
        ]);
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'patient_id'     => 'required|exists:patients,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'amount'         => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,gcash,maya,bank_transfer,credit_card',
            'status'         => 'required|in:paid,unpaid,partial',
            'payment_date'   => 'required|date',
            'notes'          => 'nullable|string',
        ]);

        $payment->update($validated);

        return redirect()->route('payments.index')
            ->with('success', 'Payment updated successfully.');
    }


    public function destroy(Payment $payment)
    {
        $payment->delete();

        return back()->with('success', 'Payment deleted.');
    }

    public function show(Payment $payment)
    {
        return Inertia::render('Payments/Receipt', [
            'payment' => [
                'id'             => $payment->id,
                'payment_no'     => $payment->payment_no,
                'patient_name'   => $payment->patient->full_name,
                'patient_phone'  => $payment->patient->phone,
                'patient_address' => collect([
                    $payment->patient->barangay,
                    $payment->patient->city,
                    $payment->patient->province,
                ])->filter()->join(', '),
                'appointment_no'  => $payment->appointment?->appointment_no,
                'treatment_type'  => $payment->appointment?->treatment_type,
                'dentist_name'    => $payment->appointment?->dentist->name,
                'amount'          => $payment->amount,
                'payment_method'  => $payment->payment_method,
                'method_label'    => $payment->method_label,
                'status'          => $payment->status,
                'payment_date'    => $payment->payment_date?->format('F d, Y'),
                'notes'           => $payment->notes,
                'created_at'      => $payment->created_at->format('F d, Y h:i A'),
            ],
        ]);
    }

}