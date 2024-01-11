<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserProfileAddressCategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = ['privat', 'geschäftlich']; // Add more as needed
        foreach ($categories as $categorie) {
            DB::table('user_profile_address_categories')->insert([
                'name' => $categorie,
                'created_at' => now(),
            ]);
        }
    }
}
