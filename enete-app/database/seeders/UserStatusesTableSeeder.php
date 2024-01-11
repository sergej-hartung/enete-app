<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserStatusesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = ['active', 'inactive', 'gespärt']; // Add more as needed
        foreach ($statuses as $status) {
            DB::table('user_statuses')->insert([
                'name' => $status,
                'created_at' => now(),
            ]);
        }
    }
}
