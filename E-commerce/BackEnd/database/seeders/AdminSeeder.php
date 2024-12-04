<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Seed Admin
        User::updateOrCreate(
            ['email' => 'Ian@gmail.com.com'], // Check if the admin already exists
            [
                'name' => 'Ian Tabares',
                'password' => Hash::make('IanIanIan'), // Hash the password
                'role' => 'admin', // Add 'role' if your table has this field
            ]
        );

        // Seed Regular User
        User::updateOrCreate(
            ['email' => 'user@example.com'], // Check if the user already exists
            [
                'name' => 'John Doe',
                'password' => Hash::make('1'), // Hash the password
                'role' => 'user', // Role is 'user' for regular users
            ]
        );
    }
}
