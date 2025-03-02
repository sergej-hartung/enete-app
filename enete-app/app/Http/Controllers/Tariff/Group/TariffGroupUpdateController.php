<?php

namespace App\Http\Controllers\Tariff\Group;

use App\Models\User\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tariff\Group\UpdateTariffGroupRequest;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Tariff\TariffGroup;
use App\Http\Resources\Tariff\Group\IndexTariffGroupResource;

class TariffGroupUpdateController extends Controller
{
    protected $tariffService;

   

    public function __invoke(UpdateTariffGroupRequest $request, $tariffGroupId)
    {
        
        try {
            DB::beginTransaction();
                if(!$tariffGroupId){
                    throw new \Exception('Tariff Group Id not exist.');
                }

                $tariffGroup = TariffGroup::findOrFail($tariffGroupId);

                if(!$tariffGroup){
                    throw new \Exception('Tariff Group not found.');
                }

                $value = $request->validated();
                $currentUserId = Auth::id();
                $value['updated_by'] = $currentUserId;
                $tariffGroup->update($value);

                activity()
                    ->performedOn($tariffGroup)
                    ->causedBy($currentUserId)
                    ->withProperties(['tariffGroup' => $value])
                    ->log('Tarif Gruppe aktualisiert');

            DB::commit();
            return new IndexTariffGroupResource($tariffGroup);
        } catch (\Exception $exception) {
            DB::rollBack();   
  
            //$this->userProfileService->cleanupUploadedFiles();

            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}