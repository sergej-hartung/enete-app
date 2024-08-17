<?php

namespace App\Http\Controllers\Tariff;

use App\Models\User\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Tariff\Tariff;
use App\Http\Resources\Tariff\ShowTariffResource;

class TariffShowController extends Controller
{
    // protected $userProfileService;

    // public function __construct(UserProfileService $userProfileService)
    // {
    //     $this->userProfileService = $userProfileService;
    // }

    public function __invoke($tarifId)
    {
        $tariff = Tariff::with(
            'comboStatus',
            'category',
            'provider', 
            'networkOperator', 
            'group', 
            'status',
            'document',
            'clacMatrices',
            'clacMatrices.attributes',
            'attributeGroups', 
            'attributeGroups.attributes', 
            'attributeGroups.attributes.inputType'
        )->find($tarifId);
        //dd($tariff);

        if (!$tariff) {
            return response()->json(['error' => 'Tariff not found'], 404);
        }
        
        return new ShowTariffResource($tariff);
        //return response()->json(['message' => 'Email successfully verified'], 200);
    }
}