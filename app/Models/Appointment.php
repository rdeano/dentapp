<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Appointment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'appointment_no', 'patient_id', 'dentist_id', 'created_by',
        'appointment_date', 'start_time', 'end_time',
        'treatment_type', 'chief_complaint', 'notes',
        'status', 'estimated_cost',
    ];

    protected $casts = [
        'appointment_date' => 'date',
        'estimated_cost'   => 'decimal:2',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function dentist()
    {
        return $this->belongsTo(User::class, 'dentist_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('appointment_date', today());
    }

    public function scopeUpcoming($query)
    {
        return $query->whereDate('appointment_date', '>=', today())
                     ->orderBy('appointment_date')
                     ->orderBy('start_time');
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($apt) {
            $apt->appointment_no = 'APT-' . date('Y') . '-' . str_pad(
                (static::withTrashed()->count() + 1), 4, '0', STR_PAD_LEFT
            );
        });
    }

   

}