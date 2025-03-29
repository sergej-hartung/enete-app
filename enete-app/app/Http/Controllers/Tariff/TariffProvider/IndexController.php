<?php

namespace App\Http\Controllers\Tariff\TariffProvider;



use App\Http\Controllers\Controller;
use App\Http\Resources\Tariff\Provider\IndexTariffProviderResource;
use App\Models\Tariff\TariffProvider;

class IndexController extends Controller
{
    public function __invoke()
    {
         //$data = TariffProvider::all();
         $data = TariffProvider::with(['groups', 'document'])
            ->get();
         return IndexTariffProviderResource::collection($data);
    }
}

