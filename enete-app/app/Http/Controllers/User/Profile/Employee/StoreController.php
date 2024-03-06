<?php

namespace App\Http\Controllers\User\Profile\Employee;


use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\Profile\Employee\StoreEmployeeProfileRequest;
use App\Services\UserProfileService;


class StoreController extends Controller
{

    protected $userProfileService;

    public function __construct(UserProfileService $userProfileService)
    {
        $this->userProfileService = $userProfileService;
    }

    public function __invoke(StoreEmployeeProfileRequest $request)
    {
        try {
            // Начало транзакции БД для обеспечения атомарности операций
            DB::beginTransaction();

            // Валидация и получение данных из запроса
            $data = $request->validated();

            $data['user_type'] = 'is_employee';

            $extractedData = $this->userProfileService->extractData($data);
                     
            $profile = $this->userProfileService->handleUserProfiles($extractedData);           
            $this->userProfileService->handleRelatedEntities($profile, $extractedData);   
            $this->userProfileService->sendEmailVerificationHash($profile);
            
            $this->userProfileService->handleUsers($request, $profile, $extractedData['users'] ?? []);

            // Фиксация транзакции
            DB::commit();
            return response('', 201);
        } catch (\Exception $exception) {
            // Откат транзакции в случае ошибки
            DB::rollBack();   
            // Очистка загруженных файлов    
            $this->userProfileService->cleanupUploadedFiles();
            // Возврат ответа с ошибкой
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

 
}
