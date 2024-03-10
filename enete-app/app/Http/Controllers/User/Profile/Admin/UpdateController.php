<?php

namespace App\Http\Controllers\User\Profile\Admin;

use App\Mail\VerifyEmail;
use App\Models\User\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Mail\SendLoginDetails;
use App\Models\User\UserProfile;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\User\Profile\Admin\UpdateAdminProfileRequest;
use App\Http\Resources\User\Profile\Admins\UpdateAdminProfileResource;
use Illuminate\Support\Facades\Storage;
use App\Services\UserProfileService;

class UpdateController extends Controller
{
    protected $userProfileService;

    public function __construct(UserProfileService $userProfileService)
    {
        $this->userProfileService = $userProfileService;
    }

    public function __invoke(UpdateAdminProfileRequest $request, $id)
    {
        try {
            DB::beginTransaction();          

            $userProfile = $this->userProfileService->updateAdminProfile($request, $id, $request->validated());

            DB::commit();
            //return response($userProfile);
            return new UpdateAdminProfileResource($userProfile);
            
        } catch (\Exception $exception) {
            DB::rollBack();

            $this->userProfileService->cleanupUploadedFiles();
            
            return response()->json(['error' => $exception->getMessage()], 500);
        }

        
    }

}
