<?php

namespace App\Http\Controllers\Tariff\Group;

use App\Models\User\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tariff\Group\StoreTariffGroupRequest;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Tariff\TariffGroup;

class TariffGroupStoreController extends Controller
{
    protected $tariffService;

   

    public function __invoke(StoreTariffGroupRequest $request)
    {
        
        try {
            DB::beginTransaction();

                $value = $request->validated();
                $currentUserId = Auth::id();
                $value['created_by'] = $currentUserId;
                $tariffGroup = TariffGroup::create($value);

                if (!$tariffGroup) {
                    // Handle the error: tariff creation failed
                    throw new \Exception('Tariff creation failed.');
                }

                // Логирование создания тарифа
                activity()
                    ->performedOn($tariffGroup)
                    ->causedBy($currentUserId)
                    ->withProperties(['tariffGroup' => $tariffGroup->toArray()]) // Логируем данные из созданной модели
                    ->log('Tarif Gruppe erstellt');
            DB::commit();
            return response('', 201);
        } catch (\Exception $exception) {
            DB::rollBack();   
  
            //$this->userProfileService->cleanupUploadedFiles();

            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}