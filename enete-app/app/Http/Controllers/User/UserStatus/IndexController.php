<?php

namespace App\Http\Controllers\User\UserStatus\Statuses;


use App\Http\Controllers\Controller;
use App\Models\User\UserStatus;

use App\Http\Resources\User\User\Statuses\IndexStatusResource;

class IndexController extends Controller
{
    public function __invoke()
    {
        $data = UserStatus::all();
        return IndexStatusResource::collection($data);
    }
}

