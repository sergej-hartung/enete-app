<?php

namespace App\Http\Controllers\Tariff\TariffAttribute;

use App\Models\User\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Tariff\TariffAttribute;

class DeleteController extends Controller
{
    public function __invoke(int $attributeId)
    {
        
        try {
            DB::beginTransaction();

            $data = TariffAttribute::find($attributeId);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'Das Tariffattribut wurde nicht gefunden.'
                ], 404);
            }
    
            if ($data->isLinked()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Das Tariffattribut kann nicht gelöscht werden, da es noch mit anderen Tabellen verknüpft ist.'
                ], 422);
            }


            $oldValues = $data->toArray();
            $currentUserId = Auth::id(); 
    
            $data->delete();

            activity()
                ->performedOn($data)
                ->causedBy($currentUserId)
                ->withProperties(['tariffAttribute' => $oldValues])
                ->log('Das Tariffattribut wurde gelöscht');

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Das Tariffattribut wurde erfolgreich gelöscht.'
            ], 200);
            
        } catch (\Exception $exception) {
            DB::rollBack();   

            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}