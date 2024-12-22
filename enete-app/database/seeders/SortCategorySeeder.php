<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SortCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('sort_categories')->insert([
            [
                'name' => 'Gesamtpreis',
                'description' => 'Gesamtpreis fon Tarif',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Grundpreis',
                'description' => 'Monatlicher Preis',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Datenvolummen',
                'description' => 'Datenvolummen',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
