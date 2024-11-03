<?php

namespace App\Http\Controllers\Tariff;

use App\Models\User\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tariff\TariffRequest;

class TariffStoreController extends Controller
{
    // protected $userProfileService;

    // public function __construct(UserProfileService $userProfileService)
    // {
    //     $this->userProfileService = $userProfileService;
    // }

    public function __invoke(TariffRequest $request)
    {
       
        var_dump($request->validated());
        //return response()->json(['message' => 'Email successfully verified'], 200);
    }
}