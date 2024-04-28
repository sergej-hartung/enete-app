<?php

namespace App\Http\Controllers\Tariff\Group;

use App\Models\Tariff;
use App\Http\Controllers\Controller;
use App\Http\Resources\Tariff\IndexTariffResource;
use App\Http\Requests\Tariff\Group\TariffByGroupRequest;
use App\Http\Filters\TariffFilter;
use App\Models\Tariff\TariffGroup;

class ProviderByGroupController extends Controller
{
    public function __invoke($id)
    {

        $group = TariffGroup::with('providers')->find($id);
        
        return IndexTariffResource::collection($group->providers);
    }
}