<?php

namespace App\Http\Controllers\User\Profile\Dockument;



use App\Http\Controllers\Controller;
use App\Http\Resources\User\Profile\Employees\ShowEmployeeProfileResource;
use App\Services\UserProfileService;
use Exception;

class DeleteController extends Controller
{

    protected $userProfileService;

    public function __construct(UserProfileService $userProfileService)
    {
        $this->userProfileService = $userProfileService;
    }

    public function __invoke($id)
    {
        try {
            $this->userProfileService->deleteProfileDocument($id);
            return response('', 204);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }
}