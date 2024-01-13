<?php

namespace App\Http\Controllers\User\Profile\Career;


use App\Http\Controllers\Controller;

use App\Models\User\UserProfileCareer;
use App\Http\Resources\User\Profile\Career\IndexCareerResource;


class IndexController extends Controller
{
    public function __invoke()
    {
        $data = UserProfileCareer::all();
        return IndexCareerResource::collection($data);
    }
}

