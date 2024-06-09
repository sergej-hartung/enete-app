<?php

namespace App\Http\Controllers\Tariff\Group;

use App\Http\Controllers\Controller;
use App\Http\Resources\Tariff\NetworkOperator\IndexTariffNetworkOperatorResource;
use App\Models\Tariff\TariffGroup;

class NetworkOperatorByGroupController extends Controller
{
    public function __invoke($id)
    {

        $group = TariffGroup::with('networkOperators')->find($id);
        
        return IndexTariffNetworkOperatorResource::collection($group->networkOperators);
    }
}