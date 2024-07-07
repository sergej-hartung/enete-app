<?php

namespace App\Http\Controllers\Tariff\TariffComboStatuses;



use App\Http\Controllers\Controller;
use App\Http\Resources\Tariff\ComboStatus\IndexTariffComboStatusResource;
use App\Models\Tariff\TariffComboStatus;

class IndexController extends Controller
{
    public function __invoke()
    {
         $data = TariffComboStatus::all();
         return IndexTariffComboStatusResource::collection($data);
    }
}

