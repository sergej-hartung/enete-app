<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TariffGroupNetworkOperatorMappSeeder  extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('tariff_group_network_operator_mappings')->insert([
            ['id' => 1, 'group_id' => 3, 'network_operator_id' => 1, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 2, 'group_id' => 3, 'network_operator_id' => 2, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 3, 'group_id' => 3, 'network_operator_id' => 3, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
        ]);
    }
}