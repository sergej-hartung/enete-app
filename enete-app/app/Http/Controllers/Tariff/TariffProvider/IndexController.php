<?php

namespace App\Http\Controllers\Tariff\TariffProvider;



use App\Http\Controllers\Controller;
use App\Http\Resources\Tariff\Provider\IndexTariffProviderResource;
use App\Http\Requests\Tariff\Provider\IndexTariffProviderRequest;
use App\Http\Filters\TariffProviderFilter;
use App\Models\Tariff\TariffProvider;

class IndexController extends Controller
{
    public function __invoke(IndexTariffProviderRequest $request)
    {
        $queryParams = $request->validated();

        $filter = app()->make(TariffProviderFilter::class, ['queryParams' => $queryParams]);
         //$data = TariffProvider::all();
         $data = TariffProvider::with(['groups', 'document'])
            ->filter($filter)
            ->sort($queryParams)
            ->get();
         return IndexTariffProviderResource::collection($data);
    }
}

