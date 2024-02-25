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
            ['admin','Administrator'], 
            ['vp','Vertriebspartner'],
            ['vision_vp','Vision Vp'],
            ['shop','Shop'],
        ];
        foreach ($careers as $career) {
            DB::table('user_roles')->insert([
                'name' => $career[0],
                'description' => $career[1],
                'created_at' => now(),
            ]);
        }
    }
}
