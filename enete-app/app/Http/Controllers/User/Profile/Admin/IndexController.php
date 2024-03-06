<?php

namespace App\Http\Controllers\User\Profile\Admin;


use App\Models\User\UserProfile;
use App\Http\Controllers\Controller;
use App\Http\Filters\UserProfileFilter;
use App\Http\Resources\User\Profile\Admins\IndexAdminProfileResource;
use App\Http\Requests\User\Profile\Admin\IndexAdminProfileRequest;

class IndexController extends Controller
{
    
    public function __invoke(IndexAdminProfileRequest $request)
    {
        $data = $request->validated();

        $filter = app()->make(UserProfileFilter::class, ['queryParams' => array_filter($data)]);

        $profile = UserProfile::with(['users'])->where('user_type', '=', 'is_admin')->filter($filter)->sort($data)->get();

        
        return IndexAdminProfileResource::collection($profile);
    }
}

