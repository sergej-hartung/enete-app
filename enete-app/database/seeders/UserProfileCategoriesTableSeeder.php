<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserProfileCategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categorys = [[49,'Vertrieb'], [10,'Shop']];
        foreach ($categorys as $category) {
            DB::table('user_profile_categories')->insert([
                'index' => $category[0],
                'name' => $category[1],
                'created_at' => now(),
            ]);
        }
    }
}
