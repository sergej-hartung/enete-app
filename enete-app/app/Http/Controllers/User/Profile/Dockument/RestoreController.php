<?php

namespace App\Http\Controllers\User\Profile\Dockument;


use App\Http\Controllers\Controller;
use App\Http\Requests\User\Profile\Documents\IndexDocumentsRequest;
use App\Http\Resources\User\Profile\Documents\DocumentsResource;
use App\Services\UserProfileService;

class RestoreController extends Controller
{
    protected $userProfileService;

    public function __construct(UserProfileService $userProfileService)
    {
        $this->userProfileService = $userProfileService;
    }

    public function __invoke($id)
    { 
        $this->userProfileService->restoreProfileDocument($id);

        return response('', 200);
    }
}

