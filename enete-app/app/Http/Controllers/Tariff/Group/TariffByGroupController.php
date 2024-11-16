<?php

namespace App\Http\Controllers\Tariff\Group;

use App\Models\Tariff\Tariff;
use App\Http\Controllers\Controller;
use App\Http\Resources\Tariff\IndexTariffResource;
use App\Http\Requests\Tariff\Group\TariffByGroupRequest;
use App\Http\Filters\TariffFilter;

class TariffByGroupController extends Controller
{
    public function __invoke(TariffByGroupRequest $request, $id)
    {
        $queryParams = $request->validated();

        //$filter = app()->make(TariffFilter::class, ['queryParams' => array_filter($request->validated())]);
        $filter = app()->make(TariffFilter::class, ['queryParams' => $queryParams]);

        $data = Tariff::with(['provider', 'networkOperator', 'group', 'status'])
            ->where('group_id', '=', $id)
            ->filter($filter)
            ->sort($request->validated())
            ->get(); 
        
        return IndexTariffResource::collection($data);
    }
}