<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserAdminTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = [
            'user_profile_id' => 1, 
            'login_name' => 'sergej_hartung',
            'password' => Hash::make('Sergej83'),
            'role_id' => 1,
            'status_id' => 1,
            'created_at' => now()

        ]; 
        DB::table('users')->insert($user);
    }
}
