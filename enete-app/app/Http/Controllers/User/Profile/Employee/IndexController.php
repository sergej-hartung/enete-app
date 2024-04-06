<?php

namespace App\Http\Controllers\User\Profile\Employee;


use App\Models\User\UserProfile;
use App\Http\Controllers\Controller;
use App\Http\Filters\UserProfileFilter;
use App\Http\Resources\User\Profile\Employees\IndexEmployeeProfileResource;
use App\Http\Requests\User\Profile\Employee\IndexEmployeeProfileRequest;
use App\Http\Resources\User\Profile\Employees\ParentEmployeeProfileResource;
use App\Services\UserProfileService;

class IndexController extends Controller
{
    protected $userProfileService;

    public function __construct(UserProfileService $userProfileService)
    {
        $this->userProfileService = $userProfileService;
    }

    public function __invoke(IndexEmployeeProfileRequest $request, $type = null)
    { 
        $profiles = $this->userProfileService->getEmployeeProfiles($request->validated());
        if($type === 'parent'){
            return ParentEmployeeProfileResource::collection($profiles);
        }else{
            return IndexEmployeeProfileResource::collection($profiles);
        }
        
    }
}

