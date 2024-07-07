<?php

namespace App\Http\Controllers\Tariff\TariffCategory;



use App\Http\Controllers\Controller;
use App\Http\Resources\Tariff\Category\IndexTariffCategoryResource;
use App\Models\Tariff\TariffCategory;

class IndexController extends Controller
{
    public function __invoke()
    {
         $data = TariffCategory::all();

         return IndexTariffCategoryResource::collection($data);
    }
}

