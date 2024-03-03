<?php

namespace App\Http\Controllers\User\Profile\Employee\EmployeeDetails\Career;


use App\Http\Controllers\Controller;

use App\Models\User\UserEmployeeDetailsCareer;
use App\Http\Resources\User\Profile\Employees\EmployeeDetails\Career\IndexCareerResource;


class IndexController extends Controller
{
    public function __invoke()
    {
        $data = UserEmployeeDetailsCareer::all();
        return IndexCareerResource::collection($data);
    }
}

