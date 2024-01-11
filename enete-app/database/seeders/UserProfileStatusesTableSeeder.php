<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserProfileStatusesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = ['Aktiv', 'Inaktiv', 'Gesperrt', 'Gekündigt', 'Interessent']; // Add more as needed
        foreach ($statuses as $status) {
            DB::table('user_profile_statuses')->insert([
                'name' => $status,
                'created_at' => now(),
            ]);
        }
    }
}
