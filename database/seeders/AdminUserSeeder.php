<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@dentapp.com'],
            [
                'name'      => 'Dr. Reyes',
                'password'  => Hash::make('password'),
                'is_active' => true,
            ]
        );
        $admin->assignRole('Admin');

        $dentist = User::firstOrCreate(
            ['email' => 'dentist@dentapp.com'],
            [
                'name'           => 'Dr. Santos',
                'password'       => Hash::make('password'),
                'specialization' => 'General Dentistry',
                'is_active'      => true,
            ]
        );
        $dentist->assignRole('Dentist');

        $receptionist = User::firstOrCreate(
            ['email' => 'reception@dentapp.com'],
            [
                'name'      => 'Ana Cruz',
                'password'  => Hash::make('password'),
                'is_active' => true,
            ]
        );
        $receptionist->assignRole('Receptionist');

        $receptionist = User::firstOrCreate(
            ['email' => 'staff@dentapp.com'],
            [
                'name'      => 'Front Desk',
                'password'  => Hash::make('password'),
                'is_active' => true,
            ]
        );
        $receptionist->assignRole('Receptionist');

    }
}