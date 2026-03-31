<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'view dashboard',
            'view appointments',
            'create appointments',
            'edit appointments',
            'delete appointments',
            'view patients',
            'create patients',
            'edit patients',
            'delete patients',
            'view billing',
            'create billing',
            'edit billing',
            'view users',
            'create users',
            'edit users',
            'delete users',
            'view reports',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $admin->givePermissionTo(Permission::all());

        $dentist = Role::firstOrCreate(['name' => 'Dentist']);
        $dentist->givePermissionTo([
            'view dashboard',
            'view appointments',
            'create appointments',
            'edit appointments',
            'view patients',
            'create patients',
            'edit patients',
        ]);

        $receptionist = Role::firstOrCreate(['name' => 'Receptionist']);
        $receptionist->givePermissionTo([
            'view dashboard',
            'view appointments',
            'create appointments',
            'edit appointments',
            'view patients',
            'create patients',
            'edit patients',
            'view billing',
            'create billing',
        ]);
    }
}