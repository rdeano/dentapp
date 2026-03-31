<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Treatment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'default_price',
        'duration_minutes',
        'is_active',
    ];

    protected $casts = [
        'default_price'    => 'decimal:2',
        'duration_minutes' => 'integer',
        'is_active'        => 'boolean',
    ];
}