<?php

namespace App\Http\Controllers\Tariff\TariffNetworkOperator;


use App\Http\Controllers\Controller;
use App\Http\Resources\Tariff\NetworkOperator\IndexTariffNetworkOperatorResource;
use App\Models\Tariff\TariffNetworkOperator;

class IndexController extends Controller
{
    public function __invoke()
    {
        $data = TariffNetworkOperator::all();
        // $data = UserStatus::all();
         return IndexTariffNetworkOperatorResource::collection($data);
    }
}

