<?php

namespace Database\Seeders;

use App\Models\Treatment;
use Illuminate\Database\Seeder;

class TreatmentSeeder extends Seeder
{
    public function run(): void
    {
        $treatments = [
            ['name' => 'General Cleaning',     'default_price' => 500,   'duration_minutes' => 30],
            ['name' => 'Oral Prophylaxis',      'default_price' => 800,   'duration_minutes' => 45],
            ['name' => 'Tooth Extraction',      'default_price' => 1500,  'duration_minutes' => 30],
            ['name' => 'Dental Filling',        'default_price' => 1200,  'duration_minutes' => 45],
            ['name' => 'Root Canal',            'default_price' => 8000,  'duration_minutes' => 90],
            ['name' => 'Teeth Whitening',       'default_price' => 5000,  'duration_minutes' => 60],
            ['name' => 'Crown Fitting',         'default_price' => 12000, 'duration_minutes' => 60],
            ['name' => 'Orthodontic Consult',   'default_price' => 500,   'duration_minutes' => 30],
            ['name' => 'Braces Installation',   'default_price' => 35000, 'duration_minutes' => 120],
            ['name' => 'Braces Adjustment',     'default_price' => 1000,  'duration_minutes' => 30],
            ['name' => 'Dentures',              'default_price' => 15000, 'duration_minutes' => 60],
            ['name' => 'X-Ray',                 'default_price' => 300,   'duration_minutes' => 15],
            ['name' => 'Consultation',          'default_price' => 300,   'duration_minutes' => 20],
            ['name' => 'Fluoride Treatment',    'default_price' => 600,   'duration_minutes' => 20],
            ['name' => 'Pit & Fissure Sealant', 'default_price' => 800,   'duration_minutes' => 30],
        ];

        foreach ($treatments as $treatment) {
            Treatment::firstOrCreate(
                ['name' => $treatment['name']],
                array_merge($treatment, ['is_active' => true])
            );
        }
    }
}