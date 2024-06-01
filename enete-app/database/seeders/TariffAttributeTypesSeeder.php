<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TariffAttributeTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('tariff_attribute_types')->insert([
            ['id' => 1, 'name' => 'Dropdown', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()], 
            ['id' => 2, 'name' => 'Mehrfachauswahl', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],  
            ['id' => 3, 'name' => 'Dezimalzahlen', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],  
            ['id' => 4, 'name' => 'Ganzzahlen', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],  
            ['id' => 5, 'name' => 'Textfeld', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],  
            ['id' => 6, 'name' => 'Textbereich', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],  
            ['id' => 7, 'name' => 'Datumfeld', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],  
            ['id' => 8, 'name' => 'Link-Feld', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],  
            ['id' => 9, 'name' => 'Boolescher Wert', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],  
            ['id' => 10, 'name' => 'Dateifeld', 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],       
        ]);
    }
}

