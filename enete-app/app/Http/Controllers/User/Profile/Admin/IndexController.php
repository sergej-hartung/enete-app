<?php

namespace App\Http\Controllers\User\Profile\Admin;


use App\Models\User\UserProfile;
use App\Http\Controllers\Controller;
use App\Http\Filters\UserProfileFilter;
use App\Http\Resources\User\Profile\Admins\IndexAdminProfileResource;
use App\Http\Requests\User\Profile\Admin\IndexAdminProfileRequest;
use App\Services\UserProfileService;

class IndexController extends Controller
{
    protected $userProfileService;

    public function __construct(UserProfileService $userProfileService)
    {
        $this->userProfileService = $userProfileService;
    }
    
    public function __invoke(IndexAdminProfileRequest $request)
    {

        $profiles = $this->userProfileService->getAdminProfiles($request->validated());
        
        return IndexAdminProfileResource::collection($profiles);
    }
}

