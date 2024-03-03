<?php

namespace App\Http\Controllers\User\Profile\Employee\EmployeeDetails\Categorie;


use App\Http\Controllers\Controller;

use App\Models\User\UserEmployeeDetailsCategorie;
use App\Http\Resources\User\Profile\Employees\EmployeeDetails\Categorie\IndexCategorieResource;

class IndexController extends Controller
{
    public function __invoke()
    {
        $data = UserEmployeeDetailsCategorie::all();
        return IndexCategorieResource::collection($data);
    }
}

