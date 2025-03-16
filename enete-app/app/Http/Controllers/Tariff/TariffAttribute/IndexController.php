<?php

namespace App\Http\Controllers\Tariff\TariffAttribute;

use App\Models\Tariff;
use App\Http\Controllers\Controller;
use App\Http\Resources\Tariff\Attribute\IndexTariffAttributeResource;
use App\Http\Requests\Tariff\Attribute\IndexTariffAttributeRequest;
use App\Http\Filters\TariffAttributeFilter;
use App\Models\Tariff\TariffAttribute;

class IndexController extends Controller
{
    public function __invoke(IndexTariffAttributeRequest $request){
        $queryParams = $request->validated();

        $filter = app()->make(TariffAttributeFilter::class, ['queryParams' => $queryParams]);

        $data = TariffAttribute::with(['inputType', 'tariffGroups'])
            ->filter($filter)
            ->sort($queryParams)
            ->get();

        return IndexTariffAttributeResource::collection($data);      
    }
}