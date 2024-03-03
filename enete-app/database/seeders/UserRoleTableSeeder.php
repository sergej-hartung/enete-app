<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserRoleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $careers = [
            ['admin','Administrator','is_admin'], 
            ['vp','Vertriebspartner','is_employee'],
            ['vision_vp','Vision Vp','is_employee'],
            ['shop','Shop', 'is_employee'],
        ];
        foreach ($careers as $career) {
            DB::table('user_roles')->insert([
                'name' => $career[0],
                'description' => $career[1],
                'type' => $career[2],
                'created_at' => now(),
            ]);
        }
    }
}
