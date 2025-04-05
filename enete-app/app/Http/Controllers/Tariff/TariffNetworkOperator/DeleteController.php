<?php

namespace App\Http\Controllers\Tariff\TariffNetworkOperator;

use App\Models\User\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Tariff\TariffNetworkOperator;

class DeleteController extends Controller
{
    public function __invoke(int $attributeId)
    {
        
        try {
            DB::beginTransaction();

            $data = TariffNetworkOperator::find($attributeId);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'Der Netzbetreiber wurde nicht gefunden.'
                ], 404);
            }
    
            if ($data->isLinked()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Der Netzbetreiber kann nicht gelöscht werden, da er noch mit anderen Tabellen verknüpft ist.'
                ], 422);
            }


            $oldValues = $data->toArray();
            $currentUserId = Auth::id(); 
    
            $data->delete();

            activity()
                ->performedOn($data)
                ->causedBy($currentUserId)
                ->withProperties(['tariffNetworkProvider' => $oldValues])
                ->log('Der Netzbetreiber wurde gelöscht');

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Der Netzbetreiber wurde erfolgreich gelöscht.'
            ], 200);
            
        } catch (\Exception $exception) {
            DB::rollBack();   

            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}