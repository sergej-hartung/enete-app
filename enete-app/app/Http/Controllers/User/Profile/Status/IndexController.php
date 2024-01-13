<?php

namespace App\Http\Controllers\User\Profile\Status;


use App\Http\Controllers\Controller;
use App\Models\User\UserProfileStatus;

use App\Http\Resources\User\Profile\Status\IndexStatusResource;

class IndexController extends Controller
{
    public function __invoke()
    {
        $data = UserProfileStatus::all();
        return IndexStatusResource::collection($data);
    }
}

