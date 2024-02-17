<?php

namespace App\Http\Controllers\User\Profile;


use App\Models\User\UserProfile;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\User\Profile\ShowProfileResource;
use Illuminate\Support\Facades\Storage;

class ShowController extends Controller
{
    public function __invoke($profileId)
    {
        $profile = UserProfile::with(['users','parent','addresses', 'contacts', 'banks'])->find($profileId);
        if (is_null($profile)) {
            // Если профиль не найден, возвращаем 404 статус
            return response()->json([
                'message' => 'Profile not found'
            ], Response::HTTP_NOT_FOUND);
        }
        
        return new ShowProfileResource($profile);
    }
}

