<?php

namespace App\Http\Controllers\User\Profile\Dockument;


use App\Http\Controllers\Controller;
use App\Http\Requests\User\Profile\Documents\IndexDocumentsRequest;
use App\Http\Resources\User\Profile\Documents\DocumentsResource;
use App\Services\UserProfileService;

class IndexController extends Controller
{
    protected $userProfileService;

    public function __construct(UserProfileService $userProfileService)
    {
        $this->userProfileService = $userProfileService;
    }

    public function __invoke(IndexDocumentsRequest $request)
    { 
         $documents = $this->userProfileService->getProfileDocuments($request->validated());
        // if($type === 'deleted'){
        //     return ParentEmployeeProfileResource::collection($profiles);
        // }else{
        //     return IndexEmployeeProfileResource::collection($profiles);
        // }

        return DocumentsResource::collection($documents);
    }
}

