<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TariffCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('tariff_categories')->insert([
            ['id' => 1, 'name' => 'Privat',  'is_filter_active' => 1, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 2, 'name' => 'Business',  'is_filter_active' => 0, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 3, 'name' => 'Jungeleute',  'is_filter_active' => 1, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 4, 'name' => 'VVL',  'is_filter_active' => 1, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
        ]);
    }
}
