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
            UserEmployeeDetailsCareerTableSeeder::class,
            UserEmployeeDetailsCategoriesTableSeeder::class,
            UserProfileContactCategoriesTableSeeder::class,
            UserProfileContactTypesTableSeeder::class,
            UserEmployeeDetailsStatusesTableSeeder::class,
            UserRoleTableSeeder::class,
            UserStatusesTableSeeder::class,
            UserAdminProfileTableSeeder::class,
            UserAdminTableSeeder::class,
            TariffGroupSeeder::class,
            TariffStatusSeeder::class,
            TariffProviderSeeder::class,
            TariffGroupProviderMappSeeder::class,
            TariffNetworkOperatorSeeder::class,
            TariffGroupNetworkOperatorMappSeeder::class
        ]);
    }
}
