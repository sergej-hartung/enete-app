<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TariffSortCriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tariff_sorting_criterias')->insert([
            [
                //'group_id' => 3,
                'name' => 'Gesamtpreis',
                'description' => 'Gesamtpreis fon Tarif',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                //'group_id' => 3,
                'name' => 'Grundpreis',
                'description' => 'Monatlicher Preis',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                //'group_id' => 3,
                'name' => 'Datenvolummen',
                'description' => 'Datenvolummen',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
