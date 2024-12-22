<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TariffProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('tariff_providers')->insert([
            ['id' => 1, 'name' => 'Vodafone',         'logo_id' => null, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 2, 'name' => 'O2 Telefonica',    'logo_id' => null, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 3, 'name' => 'Yurfone',          'logo_id' => null, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 4, 'name' => 'Otelo',            'logo_id' => null, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 5, 'name' => 'klarmobil',        'logo_id' => null, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 6, 'name' => 'mobilcom debitel', 'logo_id' => null, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 7, 'name' => 'Blau',             'logo_id' => null, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 8, 'name' => '1&1',              'logo_id' => null, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 9, 'name' => 'T-Momile',         'logo_id' => null, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 10, 'name' => 'Telecom',         'logo_id' => null, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 11, 'name' => '1&1 Internet AG', 'logo_id' => null, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 12, 'name' => 'Ay Yildiz',       'logo_id' => null, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 13, 'name' => 'GASAG',           'logo_id' => null, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 14, 'name' => 'badenova',        'logo_id' => null, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
            ['id' => 15, 'name' => 'BayWa Ökoenergie GmbH', 'logo_id' => null, 'created_by' => 1, 'updated_by' => null, 'created_at' => now()],
        ]);
    }
}
