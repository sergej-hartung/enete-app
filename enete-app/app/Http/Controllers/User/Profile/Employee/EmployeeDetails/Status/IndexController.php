<?php

namespace App\Http\Controllers\User\Profile\Employee\EmployeeDetails\Status;


use App\Http\Controllers\Controller;
use App\Models\User\UserEmployeeDetailsStatus;

use App\Http\Resources\User\Profile\Employees\EmployeeDetails\Status\IndexStatusResource;

class IndexController extends Controller
{
    public function __invoke()
    {
        $data = UserEmployeeDetailsStatus::all();
        return IndexStatusResource::collection($data);
    }
}

