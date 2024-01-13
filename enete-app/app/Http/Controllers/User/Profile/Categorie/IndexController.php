<?php

namespace App\Http\Controllers\User\Profile\Categorie;


use App\Http\Controllers\Controller;

use App\Models\User\UserProfileCategorie;
use App\Http\Resources\User\Profile\Categorie\IndexCategorieResource;

class IndexController extends Controller
{
    public function __invoke()
    {
        $data = UserProfileCategorie::all();
        return IndexCategorieResource::collection($data);
    }
}

