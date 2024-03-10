<?php

namespace App\Http\Controllers\User\Profile\Employee;


use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\Profile\Employee\StoreEmployeeProfileRequest;
use App\Services\UserProfileService;


class StoreController extends Controller
{

    protected $userProfileService;

    public function __construct(UserProfileService $userProfileService)
    {
        $this->userProfileService = $userProfileService;
    }

    public function __invoke(StoreEmployeeProfileRequest $request)
    {
        try {
            DB::beginTransaction();

            $this->userProfileService->createEmployeeProfile($request, $request->validated());

            DB::commit();
            return response('', 201);
        } catch (\Exception $exception) {
            DB::rollBack();   
  
            $this->userProfileService->cleanupUploadedFiles();

            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

 
}
