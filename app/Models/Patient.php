<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Patient extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'patient_no', 'first_name', 'middle_name', 'last_name',
        'gender', 'date_of_birth', 'email', 'phone',
        'barangay', 'city', 'province',
        'emergency_contact_name', 'emergency_contact_phone',
        'medical_history', 'allergies', 'notes', 'is_active',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'is_active'     => 'boolean',
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getInitialsAttribute(): string
    {
        return strtoupper($this->first_name[0] . $this->last_name[0]);
    }

    public function getAgeAttribute(): int
    {
        return $this->date_of_birth->age;
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($patient) {
            $patient->patient_no = 'PT-' . date('Y') . '-' . str_pad(
                (static::withTrashed()->count() + 1), 4, '0', STR_PAD_LEFT
            );
        });
    }
}