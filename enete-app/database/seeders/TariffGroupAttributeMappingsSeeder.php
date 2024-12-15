<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TariffGroupAttributeMappingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('tariff_group_attribute_mappings')->insert([
            ['id' => 1, 'group_id' => 3, 'attribute_id' => 1, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()], 
            ['id' => 2, 'group_id' => 3, 'attribute_id' => 2, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 3, 'group_id' => 3, 'attribute_id' => 3, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 4, 'group_id' => 3, 'attribute_id' => 4, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 5, 'group_id' => 3, 'attribute_id' => 5, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 6, 'group_id' => 3, 'attribute_id' => 6, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 7, 'group_id' => 3, 'attribute_id' => 7, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 8, 'group_id' => 3, 'attribute_id' => 8, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 9, 'group_id' => 3, 'attribute_id' => 9, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 10, 'group_id' => 3, 'attribute_id' => 10, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 11, 'group_id' => 3, 'attribute_id' => 11, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 12, 'group_id' => 3, 'attribute_id' => 12, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 13, 'group_id' => 3, 'attribute_id' => 13, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 14, 'group_id' => 3, 'attribute_id' => 14, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 15, 'group_id' => 3, 'attribute_id' => 15, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],  
            ['id' => 16, 'group_id' => 3, 'attribute_id' => 16, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],  
        ]);
    }
}

