<?php

namespace App\Http\Controllers\User\Profile\Admin;


use App\Models\User\UserProfile;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\User\Profile\Admins\ShowAdminProfileResource;
use Illuminate\Support\Facades\Storage;

class ShowController extends Controller
{
    public function __invoke($profileId)
    {
        $profile = UserProfile::with(['users', 'users.status','addresses', 'contacts', ])->where('user_type', '=', 'is_admin')->find($profileId);
        if (is_null($profile)) {
            // Если профиль не найден, возвращаем 404 статус
            return response()->json([
                'message' => 'Profile not found'
            ], Response::HTTP_NOT_FOUND);
        }
        
        return new ShowAdminProfileResource($profile);
    }
}

