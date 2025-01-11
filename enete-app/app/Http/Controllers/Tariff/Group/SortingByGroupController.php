<?php

namespace App\Http\Controllers\Tariff\Group;

use App\Models\Tariff;
use App\Http\Controllers\Controller;
//use App\Http\Resources\Tariff\Attribute\IndexTariffAttributeResource;
use App\Http\Resources\Tariff\Sorting\IndexTariffSortingResource;
use App\Http\Requests\Tariff\Group\TariffByGroupRequest;
use App\Http\Filters\TariffFilter;
use App\Models\Tariff\TariffGroup;

class SortingByGroupController extends Controller
{
    public function __invoke($id)
    {

        $group = TariffGroup::with('sorting')->find($id);
        //var_dump($group->sorting);
        return IndexTariffSortingResource::collection($group->sorting);
    }
}