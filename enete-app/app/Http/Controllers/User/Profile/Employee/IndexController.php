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
        $data = $request->validated();
        $filter = app()->make(UserProfileFilter::class, ['queryParams' => array_filter($data)]);

        $profiles = UserProfile::with(['users', 'employee.status'])->where('user_type', '=', 'is_employee')->filter($filter)->sort($data)->get();

        $fieldsToDecrypt = ['first_name', 'last_name']; 

        foreach($profiles as $profile){
            $this->userProfileService->decryptFields($profile, $fieldsToDecrypt);
        }    
        
        return IndexEmployeeProfileResource::collection($profiles);
    }
}

