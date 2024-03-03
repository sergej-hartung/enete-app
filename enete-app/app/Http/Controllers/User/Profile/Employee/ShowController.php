<?php

namespace App\Http\Controllers\User\Profile\Employee;


use App\Models\User\UserProfile;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\User\Profile\Employees\ShowProfileResource;
use Illuminate\Support\Facades\Storage;

class ShowController extends Controller
{
    public function __invoke($profileId)
    {
        $profile = UserProfile::with(['users', 'users.status','parent','addresses', 'contacts', 'banks', 'employee'])
                                        ->where('user_type', '=', 'is_employee')->find($profileId);

        if (is_null($profile)) {
            // Если профиль не найден, возвращаем 404 статус
            return response()->json([
                'message' => 'Profile not found'
            ], Response::HTTP_NOT_FOUND);
        }
        
        return new ShowProfileResource($profile);
    }
}

