<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TariffStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('tariff_statuses')->insert([
            ['id' => 1, 'name' => 'aktiv',          'icon' => 'fas fa-check-circle', 'color' => '#69B548', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 2, 'name' => 'inaktiv',       'icon' => 'fas fa-times-circle', 'color' => '#c00', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 3, 'name' => 'unvollstaendig', 'icon' => 'fas fa-question-circle', 'color' => '#F8BC03', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 4, 'name' => 'Archiv',         'icon' => 'fas fa-archive', 'color' => '#542200', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()]
        ]);
    }
}

