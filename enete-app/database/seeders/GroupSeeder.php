<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('groups')->insert([
            ['id' => 1, 'name' => 'Strom', 'icon' => 'fas fa-lightbulb', 'color' => '#FCC50C', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 2, 'name' => 'Gas', 'icon' => 'fas fa-fire', 'color' => '#0874FF', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 3, 'name' => 'Mobilfunk', 'icon' => 'fas fa-mobile-alt', 'color' => '#363636', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 4, 'name' => 'Daten', 'icon' => 'fas fa-rss', 'color' => '#0874FF', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 5, 'name' => 'DSL', 'icon' => 'fas fa-globe-europe', 'color' => '#4281CA', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 6, 'name' => 'TV', 'icon' => 'fas fa-tv', 'color' => '#363636', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()]
        ]);
    }
}