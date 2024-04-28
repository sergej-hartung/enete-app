<?php

namespace App\Http\Controllers\Tariff\Group;

use App\Models\Tariff\TariffGroup;
use App\Http\Controllers\Controller;
use App\Http\Resources\Tariff\Group\IndexTariffGroupResource;

class TariffGroupIndexController extends Controller
{
    public function __invoke()
    {
        $data = TariffGroup::all();
        return IndexTariffGroupResource::collection($data);
    }
}