<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TariffComboStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('tariff_combo_statuses')->insert([
            ['name' => 'ohne Hardware', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['name' => 'mit Hardware',  'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
        ]);
    }
}
