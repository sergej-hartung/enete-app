<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserEmployeeDetailsCareerTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $careers = [
            [10,'KB'], 
            [20,'VL'],
            [30,'TL'],
            [40,'OL'],
            [41,'OL*'],
            [42,'OL**'],
            [50,'TM'],
            [51,'TM*'],
            [52,'TM**'],
            [60,'OM'],
            [61,'OM*'],
            [70,'NM'],
        ];
        foreach ($careers as $career) {
            DB::table('user_employee_details_careers')->insert([
                'stages' => $career[0],
                'stages_description' => $career[1],
                'created_at' => now(),
            ]);
        }
    }
}
