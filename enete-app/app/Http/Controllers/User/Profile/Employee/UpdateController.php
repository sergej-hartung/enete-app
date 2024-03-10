<?php

namespace App\Http\Controllers\User\Profile\Employee;

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
use App\Http\Requests\User\Profile\Employee\UpdateEmployeeProfileRequest;
use App\Http\Resources\User\Profile\Employees\UpdateEmployeeProfileResource;
use Illuminate\Support\Facades\Storage;
use App\Services\UserProfileService;

class UpdateController extends Controller
{
    protected $userProfileService;

    public function __construct(UserProfileService $userProfileService)
    {
        $this->userProfileService = $userProfileService;
    }

    public function __invoke(UpdateEmployeeProfileRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $data = $request->validated();

            $userProfile = $this->userProfileService->updateEmployeeProfile($request, $id, $data);

            DB::commit();

            return new UpdateEmployeeProfileResource($userProfile);
            
        } catch (\Exception $exception) {
            DB::rollBack();

            $this->userProfileService->cleanupUploadedFiles();
            
            return response()->json(['error' => $exception->getMessage()], 500);
        }

        
    }

}
