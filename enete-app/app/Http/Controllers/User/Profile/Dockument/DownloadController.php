<?php

namespace App\Http\Controllers\User\Profile\Dockument;



use App\Http\Controllers\Controller;
use App\Http\Resources\User\Profile\Employees\ShowEmployeeProfileResource;
use App\Services\UserProfileService;
use Exception;

class DownloadController extends Controller
{

    protected $userProfileService;

    public function __construct(UserProfileService $userProfileService)
    {
        $this->userProfileService = $userProfileService;
    }

    public function __invoke($id)
    {
        try {
            return $this->userProfileService->downloadProfileDocument($id);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }
}