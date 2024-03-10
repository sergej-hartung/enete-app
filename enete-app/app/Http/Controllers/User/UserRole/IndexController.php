<?php

namespace App\Http\Controllers\User\UserRole\Status;


use App\Http\Controllers\Controller;
use App\Models\User\UserProfileStatus;

use App\Http\Resources\User\User\Roles\IndexRoleResource;

class IndexController extends Controller
{
    public function __invoke()
    {
        $data = UserProfileStatus::all();
        return IndexRoleResource::collection($data);
    }
}

