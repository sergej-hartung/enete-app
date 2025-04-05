<?php

namespace App\Http\Controllers\Tariff\TariffNetworkOperator;


use App\Http\Controllers\Controller;
use App\Http\Resources\Tariff\NetworkOperator\IndexTariffNetworkOperatorResource;
use App\Http\Requests\Tariff\NetworkOperator\IndexNetworkOperatorRequest;
use App\Http\Filters\TariffNetworkOperatorFilter;
use App\Models\Tariff\TariffNetworkOperator;

class IndexController extends Controller
{
    public function __invoke(IndexNetworkOperatorRequest $request)
    {
        // $data = TariffNetworkOperator::all();
        // // $data = UserStatus::all();
        //  return IndexTariffNetworkOperatorResource::collection($data);

        $queryParams = $request->validated();

        $filter = app()->make(TariffNetworkOperatorFilter::class, ['queryParams' => $queryParams]);
         //$data = TariffProvider::all();
         $data = TariffNetworkOperator::with(['groups', 'document'])
            ->filter($filter)
            ->sort($queryParams)
            ->get();
         return IndexTariffNetworkOperatorResource::collection($data);
    }
}

