<?php

namespace App\Http\Controllers\Tariff\TariffAttribute;

use App\Models\Tariff;
use App\Http\Controllers\Controller;
use App\Http\Resources\Tariff\Attribute\IndexTariffAttributeResource;
//use App\Http\Filters\TariffFilter;
use App\Models\Tariff\TariffAttribute;

class IndexController extends Controller
{
    public function __invoke(){
        $data = TariffAttribute::with(['inputType', 'tariffGroups'])->get();
        return IndexTariffAttributeResource::collection($data);      
    }
}