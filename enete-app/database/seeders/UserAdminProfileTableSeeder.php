<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserAdminProfileTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userProfile = [
            'id' => 1,
            'salutation' => 'Herr', 
            'first_name' => 'Sergej',
            'last_name' => 'Hartung',
            'email' => 'sergej_hartung@gmx.net',
            'status_id' => 1,
            'created_at' => now()

        ]; 
        DB::table('user_profiles')->insert($userProfile);
    }
}
