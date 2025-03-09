<?php

namespace App\Http\Controllers\Tariff\TariffAttributeType;

use App\Models\Tariff;
use App\Http\Controllers\Controller;
use App\Http\Resources\Tariff\AttributeType\IndexTariffAttributeTypeResource;
//use App\Http\Filters\TariffFilter;
use App\Models\Tariff\TariffAttributeType;

class IndexController extends Controller
{
    public function __invoke(){
        $data = TariffAttributeType::all();
        return IndexTariffAttributeTypeResource::collection($data);      
    }
}