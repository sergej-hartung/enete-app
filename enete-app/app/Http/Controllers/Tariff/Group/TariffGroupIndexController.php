<?php

namespace App\Http\Controllers\Tariff\Group;

use App\Models\Group;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Tariff\Group\IndexTariffGroupResource;

class TariffGroupIndexController extends Controller
{
    // protected $userProfileService;

    // public function __construct(UserProfileService $userProfileService)
    // {
    //     $this->userProfileService = $userProfileService;
    // }

    public function __invoke()
    {
        $data = Group::all();
        return IndexTariffGroupResource::collection($data);
    }
}