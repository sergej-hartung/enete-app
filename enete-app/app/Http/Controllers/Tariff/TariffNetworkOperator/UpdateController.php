<?php

namespace App\Http\Controllers\Tariff\TariffNetworkOperator;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Tariff\TariffNetworkOperator;
use App\Http\Requests\Tariff\NetworkOperator\UpdateNetworkOperatorRequest;
use App\Http\Resources\Tariff\NetworkOperator\IndexTariffNetworkOperatorResource;

class UpdateController extends Controller
{
    public function __invoke(UpdateNetworkOperatorRequest $request, $id)
    {
        try {
            DB::beginTransaction();

            if(!$id){
                throw new \Exception('Tariff Network Operator Id not exist.');
            }

            $tariffNetworkOperator = TariffNetworkOperator::findOrFail($id);

            if(!$tariffNetworkOperator){
                throw new \Exception('Tariff Network Operator not found.');
            }

            $data = $request->validated();
            $currentUserId = Auth::id();
            $updateData = [];

            // Nur geänderte Hauptfelder aktualisieren
            $fillableFields = [
                'logo_id',
                'name',
            ];

            foreach ($fillableFields as $field) {
                if ($request->has($field)) {
                    $updateData[$field] = $data[$field];
                }
            }

            // Immer updated_by setzen, wenn vorhanden
            $updateData['updated_by'] = $currentUserId;

            if (!empty($updateData)) {
                $tariffNetworkOperator->update($updateData);
            }


            // Tariff Groups nur aktualisieren, wenn im Request enthalten
            if ($request->has('tariff_groups')) {
                $tariffGroups = [];
                foreach ($data['tariff_groups'] as $group) {
                    if ($group['checked']) {
                        $tariffGroups[] = $group['id'];
                    }
                }
                $tariffNetworkOperator->groups()->sync($tariffGroups);
            }

            DB::commit();
            return new IndexTariffNetworkOperatorResource($tariffNetworkOperator->fresh()->load(['groups', 'document']));
            // return response()->json([
            //     'message' => 'Tariff attribute successfully updated',
            //     'data' => $tariffAttribute->fresh()->load('tariffGroups')
            // ], 200);

        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}