<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TariffNetworkOperatorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('tariff_network_operators')->insert([
            ['id' => 1, 'name' => 'T-Momile',         'logo_id' => null, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 2, 'name' => 'Vodafone',    'logo_id' => null, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 3, 'name' => 'O2',          'logo_id' => null, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
        ]);
    }
}
