<?php

namespace App\Http\Controllers\Tariff\Group;

use App\Models\Tariff\TariffGroup;
use App\Http\Controllers\Controller;
use App\Http\Resources\Tariff\Group\IndexTariffGroupResource;
use App\Http\Requests\Tariff\Group\IndexTariffGroupRequest;
use App\Http\Filters\TariffGroupFilter;

class TariffGroupIndexController extends Controller
{
    public function __invoke(IndexTariffGroupRequest $request)
    {
        $queryParams = $request->validated();
        $filter = app()->make(TariffGroupFilter::class, ['queryParams' => $queryParams]);
        
        //$data = TariffGroup::all();
        $data = TariffGroup::filter($filter)
            ->sort($queryParams)
            ->get();
        return IndexTariffGroupResource::collection($data);
    }
}