<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserProfileAddressCategoriesTableSeeder::class,
            UserProfileBankCategoriesTableSeeder::class,
            UserProfileCareerTableSeeder::class,
            UserProfileCategoriesTableSeeder::class,
            UserProfileContactCategoriesTableSeeder::class,
            UserProfileContactTypesTableSeeder::class,
            UserProfileStatusesTableSeeder::class,
            UserRoleTableSeeder::class,
            UserStatusesTableSeeder::class,
            
        ]);
    }
}
