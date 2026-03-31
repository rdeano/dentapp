<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'payment_no',
        'patient_id',
        'appointment_id',
        'created_by',
        'amount',
        'payment_method',
        'status',
        'notes',
        'payment_date',
    ];

    protected $casts = [
        'amount'       => 'decimal:2',
        'payment_date' => 'date',
    ];

    // Relationships
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Status color helper
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'paid'    => 'success',
            'partial' => 'warning',
            'unpaid'  => 'error',
            default   => 'default',
        };
    }

    // Payment method label
    public function getMethodLabelAttribute(): string
    {
        return match($this->payment_method) {
            'cash'          => 'Cash',
            'gcash'         => 'GCash',
            'maya'          => 'Maya',
            'bank_transfer' => 'Bank Transfer',
            'credit_card'   => 'Credit Card',
            default         => $this->payment_method,
        };
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($payment) {
            $payment->payment_no = 'PAY-' . date('Y') . '-' . str_pad(
                (static::withTrashed()->count() + 1), 4, '0', STR_PAD_LEFT
            );
        });
    }
}