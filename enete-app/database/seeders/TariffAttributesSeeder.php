<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TariffAttributesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('tariff_attributes')->insert([
            [
                'id'                  => 1, 
                'code'                => 'wifi_calling', 
                'name'                => 'WiFi Calling', 
                'input_type_id'       => 5, 
                'unit'                => null,
                'is_system'           => false,
                'is_required'         => true,
                'is_frontend_visible' => true,
                'details'             => null,
                'created_by'          => 1, 
                'updated_by'          => null, 
                'created_at'          => now()
            ],
            [
                'id'                  => 2, 
                'code'                => 'telefonie_allnet_flat', 
                'name'                => 'Telefonie Allnet Flat', 
                'input_type_id'       => 5, 
                'unit'                => null,
                'is_system'           => false,
                'is_required'         => true,
                'is_frontend_visible' => true,
                'details'             => null,
                'created_by'          => 1, 
                'updated_by'          => null, 
                'created_at'          => now()
            ],
            [
                'id'                  => 3, 
                'code'                => 'sms_allnet_flat', 
                'name'                => 'SMS Allnet Flat', 
                'input_type_id'       => 5, 
                'unit'                => null,
                'is_system'           => false,
                'is_required'         => true,
                'is_frontend_visible' => true,
                'details'             => null,
                'created_by'          => 1, 
                'updated_by'          => null, 
                'created_at'          => now()
            ],
            [
                'id'                  => 4, 
                'code'                => 'highspeed_internet_5g', 
                'name'                => 'Highspeed-Internet 5G', 
                'input_type_id'       => 5, 
                'unit'                => null,
                'is_system'           => false,
                'is_required'         => true,
                'is_frontend_visible' => true,
                'details'             => null,
                'created_by'          => 1, 
                'updated_by'          => null, 
                'created_at'          => now()
            ],
            [
                'id'                  => 5, 
                'code'                => 'eu_roaming', 
                'name'                => 'EU-Roaming', 
                'input_type_id'       => 5, 
                'unit'                => null,
                'is_system'           => false,
                'is_required'         => true,
                'is_frontend_visible' => true,
                'details'             => null,
                'created_by'          => 1, 
                'updated_by'          => null, 
                'created_at'          => now()
            ],
            [
                'id'                  => 6, 
                'code'                => 'max_speed', 
                'name'                => 'Max. Geschwindigkeit', 
                'input_type_id'       => 4, 
                'unit'                => 'Mbit/s',
                'is_system'           => false,
                'is_required'         => true,
                'is_frontend_visible' => true,
                'details'             => null,
                'created_by'          => 1, 
                'updated_by'          => null, 
                'created_at'          => now()
            ],
            [
                'id'                  => 7, 
                'code'                => 'inklusiv_volumen', 
                'name'                => 'Inklusiv-Volumen', 
                'input_type_id'       => 4, 
                'unit'                => 'GB',
                'is_system'           => false,
                'is_required'         => true,
                'is_frontend_visible' => true,
                'details'             => null,
                'created_by'          => 1, 
                'updated_by'          => null, 
                'created_at'          => now()
            ],
            [
                'id'                  => 8, 
                'code'                => 'datenatomatik', 
                'name'                => 'Datenautomatik (SpeedGo)', 
                'input_type_id'       => 3, 
                'unit'                => 'EUR',
                'is_system'           => false,
                'is_required'         => true,
                'is_frontend_visible' => true,
                'details'             => null,
                'created_by'          => 1, 
                'updated_by'          => null, 
                'created_at'          => now()
            ],
            [
                'id'                  => 9, 
                'code'                => 'anschlussgebuehr', 
                'name'                => 'Anschlussgebühr', 
                'input_type_id'       => 3, 
                'unit'                => 'EUR',
                'is_system'           => false,
                'is_required'         => true,
                'is_frontend_visible' => true,
                'details'             => null,
                'created_by'          => 1, 
                'updated_by'          => null, 
                'created_at'          => now()
            ],
            [
                'id'                  => 10, 
                'code'                => 'regulaerer_basispreis', 
                'name'                => 'Regulärer Basispreis', 
                'input_type_id'       => 3, 
                'unit'                => 'EUR',
                'is_system'           => false,
                'is_required'         => true,
                'is_frontend_visible' => true,
                'details'             => null,
                'created_by'          => 1, 
                'updated_by'          => null, 
                'created_at'          => now()
            ],
            [
                'id'                  => 11, 
                'code'                => 'aktion_volumen', 
                'name'                => 'Aktion-Volumen', 
                'input_type_id'       => 4, 
                'unit'                => 'GB',
                'is_system'           => false,
                'is_required'         => true,
                'is_frontend_visible' => true,
                'details'             => null,
                'created_by'          => 1, 
                'updated_by'          => null, 
                'created_at'          => now()
            ],
            [
                'id'                  => 12, 
                'code'                => 'rabat_1-24_monate', 
                'name'                => 'Rabat 1-24. Monat', 
                'input_type_id'       => 3, 
                'unit'                => 'EUR',
                'is_system'           => false,
                'is_required'         => true,
                'is_frontend_visible' => true,
                'details'             => null,
                'created_by'          => 1, 
                'updated_by'          => null, 
                'created_at'          => now()
            ],
            [
                'id'                  => 13, 
                'code'                => 'aktions_grundgebuehr', 
                'name'                => 'Aktions-Grundgebühr', 
                'input_type_id'       => 3, 
                'unit'                => 'EUR',
                'is_system'           => false,
                'is_required'         => true,
                'is_frontend_visible' => true,
                'details'             => null,
                'created_by'          => 1, 
                'updated_by'          => null, 
                'created_at'          => now()
            ],
            [
                'id'                  => 14, 
                'code'                => 'ab_dem_25_monat', 
                'name'                => 'ab dem 25. Monat', 
                'input_type_id'       => 3, 
                'unit'                => 'EUR',
                'is_system'           => false,
                'is_required'         => true,
                'is_frontend_visible' => true,
                'details'             => null,
                'created_by'          => 1, 
                'updated_by'          => null, 
                'created_at'          => now()
            ],
            [
                'id'                  => 15, 
                'code'                => 'hardware_zuzahlung', 
                'name'                => 'Hardware-Zuzahlung', 
                'input_type_id'       => 3, 
                'unit'                => 'EUR',
                'is_system'           => false,
                'is_required'         => true,
                'is_frontend_visible' => true,
                'details'             => null,
                'created_by'          => 1, 
                'updated_by'          => null, 
                'created_at'          => now()
            ],
            [
                'id'                  => 16, 
                'code'                => 'tariff-laufzeit', 
                'name'                => 'Tariff-Laufzeit', 
                'input_type_id'       => 4, 
                'unit'                => 'Monate',
                'is_system'           => false,
                'is_required'         => true,
                'is_frontend_visible' => true,
                'details'             => null,
                'created_by'          => 1, 
                'updated_by'          => null, 
                'created_at'          => now()
            ],
        ]);
    }
}

