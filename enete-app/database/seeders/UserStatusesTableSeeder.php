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
        $statuses = [
            ['name' => 'Aktiv', 'icon' => 'fa-circle-check fa-solid', 'color' => '#69b548'],
            ['name' => 'Inaktiv', 'icon' => 'fa-circle-exclamation fa-solid', 'color' => '#ffc107'],
            ['name' => 'Gesperrt', 'icon' => 'fa-circle-xmark fa-solid', 'color' => '#c41425'],
            // Добавьте дополнительные статусы по мере необходимости
        ];

        foreach ($statuses as $status) {
            DB::table('user_statuses')->insert([
                'name' => $status['name'],
                'icon' => $status['icon'],
                'color' => $status['color'],
                'created_at' => now(),
            ]);
        }
    }
}
