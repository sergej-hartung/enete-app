<?php

namespace App\Http\Controllers\Tariff\TariffSortingCriteria;


use App\Http\Controllers\Controller;
use App\Http\Resources\Tariff\Sorting\IndexTariffSortingResource;
use App\Http\Requests\Tariff\SortingCriteria\IndexSortingCriteriaRequest;
use App\Http\Filters\TariffSortingCriteriaFilter;
use App\Models\Tariff\TariffSortingCriteria;

class IndexController extends Controller
{
    public function __invoke(IndexSortingCriteriaRequest $request)
    {
        // $data = TariffNetworkOperator::all();
        // // $data = UserStatus::all();
        //  return IndexTariffNetworkOperatorResource::collection($data);

        $queryParams = $request->validated();

        $filter = app()->make(TariffSortingCriteriaFilter::class, ['queryParams' => $queryParams]);
         //$data = TariffProvider::all();
         $data = TariffSortingCriteria::with(['groups'])
            ->filter($filter)
            ->sort($queryParams)
            ->get();
         return IndexTariffSortingResource::collection($data);
    }
}

