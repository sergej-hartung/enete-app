<?php

namespace App\Http\Controllers\User\Profile\Admin;

use App\Mail\VerifyEmail;
use App\Mail\SendLoginDetails;
use App\Models\User\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\User\UserProfile;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\User\Profile\Admin\StoreAdminProfileRequest;
use Illuminate\Support\Facades\Storage;
use App\Services\UserProfileService;

class StoreController extends Controller
{
    protected $userProfileService;

    public function __construct(UserProfileService $userProfileService)
    {
        $this->userProfileService = $userProfileService;
    }

    public function __invoke(StoreAdminProfileRequest $request)
    {
        try {

            DB::beginTransaction();

            $this->userProfileService->createAdminProfile($request, $request->validated());

            DB::commit();
            return response('', 201);

        } catch (\Exception $exception) {
            DB::rollBack();

            $this->userProfileService->cleanupUploadedFiles();

            return response()->json(['error' => $exception->getMessage()], 500);
        }      
    }

}
