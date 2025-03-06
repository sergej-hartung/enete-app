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

class TariffGroupDeleteController extends Controller
{
    public function __invoke($tariffGroupId)
    {
        
        try {
            DB::beginTransaction();

            $tariffGroup = TariffGroup::find($tariffGroupId);

            if (!$tariffGroup) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tariff-Gruppe nicht gefunden.'
                ], 404);
            }
    
            if ($tariffGroup->isLinked()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Die Gruppe kann nicht gelöscht werden, da sie noch mit anderen Tabellen verknüpft ist.'
                ], 400);
            }

            // Speichere die Werte für das Log
            $oldValues = $tariffGroup->toArray();
            $currentUserId = Auth::id(); // Aktuell eingeloggter User
    
            $tariffGroup->delete();

            activity()
                ->performedOn($tariffGroup)
                ->causedBy($currentUserId)
                ->withProperties(['tariffGroup' => $oldValues])
                ->log('Tarif Gruppe gelöscht');

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Die Tariff-Gruppe wurde erfolgreich gelöscht.'
            ], 200);
            
        } catch (\Exception $exception) {
            DB::rollBack();   
  
            //$this->userProfileService->cleanupUploadedFiles();

            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}