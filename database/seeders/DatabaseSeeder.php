<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'username' => 'admin',
            'name' => 'Administrator',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'nip' => '0001',
            'jabatan' => 'Administrator',
        ]);

        User::create([
            'username' => 'ahmad.fauzi',
            'name' => 'Ahmad Fauzi, S.Pd',
            'password' => Hash::make('guru123'),
            'role' => 'guru',
            'nip' => '1001',
            'jabatan' => 'Guru Matematika',
        ]);

        User::create([
            'username' => 'siti.nurhaliza',
            'name' => 'Siti Nurhaliza, S.Pd',
            'password' => Hash::make('guru123'),
            'role' => 'guru',
            'nip' => '1002',
            'jabatan' => 'Guru Bahasa Indonesia',
        ]);
    }
}
