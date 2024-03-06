<?php

namespace App\Http\Controllers\User\Profile\Employee;


use App\Models\User\UserProfile;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\User\Profile\Employees\ShowEmployeeProfileResource;
use App\Services\UserProfileService;
use Illuminate\Support\Facades\Storage;

class ShowController extends Controller
{

    protected $userProfileService;

    public function __construct(UserProfileService $userProfileService)
    {
        $this->userProfileService = $userProfileService;
    }

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

        // Конфигурация для расшифровки, включая связанные данные
        $fieldsToDecrypt = ['first_name', 'last_name']; // Поля для расшифровки в основной модели
        $relationsToDecrypt = [ // Конфигурация для связанных моделей
            'addresses' => ['zip', 'city', 'street', 'house_number', 'country'], // Поля для расшифровки в связанной модели 'addresses'
            'banks' => ['first_name','last_name','zip', 'city', 'street', 'house_number', 'country', 'bic', 'iban', 'bank_name'],
            'contacts' => ['prefix', 'number']
        ];

        $this->userProfileService->decryptFields($profile, $fieldsToDecrypt, $relationsToDecrypt);
        
        return new ShowEmployeeProfileResource($profile);
    }
}

