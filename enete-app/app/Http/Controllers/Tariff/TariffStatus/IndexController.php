<?php

namespace App\Http\Controllers\Tariff\TariffStatus;


use App\Http\Controllers\Controller;
use App\Http\Resources\Tariff\Status\IndexTariffStatusResource;
use App\Models\Tariff\TariffStatus;

class IndexController extends Controller
{
    public function __invoke()
    {
        $data = TariffStatus::all();
        return IndexTariffStatusResource::collection($data);
    }
}

