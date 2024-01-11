<?php

namespace App\Http\Controllers\User\Profile;


use App\Models\User\UserProfile;
use App\Http\Controllers\Controller;
use App\Http\Filters\UserProfileFilter;
use App\Http\Resources\User\Profile\IndexProfileResource;
use App\Http\Requests\User\Profile\IndexProfileRequest;

class IndexController extends Controller
{
    public function __invoke(IndexProfileRequest $request)
    {
        $data = $request->validated();

        $filter = app()->make(UserProfileFilter::class, ['queryParams' => array_filter($data)]);
        $profile = UserProfile::filter($filter)->sort($data)->get();

        return IndexProfileResource::collection($profile);
    }
}

