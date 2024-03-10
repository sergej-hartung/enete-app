<?php

namespace App\Http\Controllers\User\Profile\Admin;


use App\Models\User\UserProfile;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\User\Profile\Admins\ShowAdminProfileResource;
use App\Services\UserProfileService;
use Illuminate\Support\Facades\Storage;

class ShowController extends Controller
{
    protected $userProfileService;

    public function __construct(UserProfileService $userProfileService)
    {
        $this->userProfileService = $userProfileService;
    }

    public function __invoke($profileId)
    {

        $profile = $this->userProfileService->findAdminProfilesById($profileId);
        
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }
        
        return new ShowAdminProfileResource($profile);
    }
}

