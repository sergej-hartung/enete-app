<?php

namespace App\Http\Controllers\User\Profile\Employee;


use App\Models\User\UserProfile;
use App\Http\Controllers\Controller;
use App\Http\Filters\UserProfileFilter;
use App\Http\Resources\User\Profile\Employees\IndexEmployeeProfileResource;
use App\Http\Requests\User\Profile\Employee\IndexEmployeeProfileRequest;
use App\Services\UserProfileService;

class IndexController extends Controller
{
    protected $userProfileService;

    public function __construct(UserProfileService $userProfileService)
    {
        $this->userProfileService = $userProfileService;
    }

    public function __invoke(IndexEmployeeProfileRequest $request)
    { 
        $profiles = $this->userProfileService->getEmployeeProfiles($request->validated());

        return IndexEmployeeProfileResource::collection($profiles);
    }
}

