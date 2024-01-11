<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserProfileContactTypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = ['Telefon', 'Mobil', 'Fax'];
        foreach ($types as $type) {
            DB::table('user_profile_contact_types')->insert([
                'name' => $type,
                'created_at' => now(),
            ]);
        }
    }
}
