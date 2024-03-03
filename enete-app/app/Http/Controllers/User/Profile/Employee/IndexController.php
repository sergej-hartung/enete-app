<?php

namespace App\Http\Controllers\User\Profile\Employee;


use App\Models\User\UserProfile;
use App\Http\Controllers\Controller;
use App\Http\Filters\UserProfileFilter;
use App\Http\Resources\User\Profile\Employees\IndexEmployeeProfileResource;
use App\Http\Requests\User\Profile\Employee\IndexEmployeeProfileRequest;

class IndexController extends Controller
{
    public function __invoke(IndexEmployeeProfileRequest $request)
    {
        $data = $request->validated();
        $filter = app()->make(UserProfileFilter::class, ['queryParams' => array_filter($data)]);

        $profile = UserProfile::with(['users', 'employee.status'])->where('user_type', '=', 'is_employee')->filter($filter)->sort($data)->get();

        
        return IndexEmployeeProfileResource::collection($profile);
    }
}

