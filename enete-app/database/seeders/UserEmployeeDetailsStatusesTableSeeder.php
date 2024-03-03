<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserEmployeeDetailsStatusesTableSeeder extends Seeder
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
            ['name' => 'Gekündigt', 'icon' => 'fa-circle-xmark fa-solid', 'color' => '#940110'],
            ['name' => 'Interessent', 'icon' => 'fa-circle-info fa-solid', 'color' => '#0dcaf0'],
            // Добавьте дополнительные статусы по мере необходимости
        ];

        foreach ($statuses as $status) {
            DB::table('user_employee_details_statuses')->insert([
                'name' => $status['name'],
                'icon' => $status['icon'],
                'color' => $status['color'],
                'created_at' => now(),
            ]);
        }
       
    }
}
