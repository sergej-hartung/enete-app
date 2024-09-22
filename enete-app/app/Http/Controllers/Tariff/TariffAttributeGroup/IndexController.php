<?php

namespace App\Http\Controllers\Tariff\TariffAttributeGroup;

use App\Models\Tariff\Tariff;
use App\Http\Controllers\Controller;
//use App\Http\Resources\Tariff\Attribute\IndexTariffAttributeResource;
use App\Http\Resources\Tariff\AttributeGroup\IndexTariffAttributeGroupResource;
use App\Http\Requests\Tariff\Group\TariffByGroupRequest;
use App\Http\Filters\TariffFilter;
use App\Models\Tariff\TariffGroup;

class IndexController extends Controller
{
    public function __invoke($tarifId)
    {

        $tariff = Tariff::with('attributeGroups', 'attributeGroups.attributs', 'attributeGroups.attributs.inputType')->find($tarifId);
        //dd($tariff->attributeGroups);
        return IndexTariffAttributeGroupResource::collection($tariff->attributeGroups);
    }
}