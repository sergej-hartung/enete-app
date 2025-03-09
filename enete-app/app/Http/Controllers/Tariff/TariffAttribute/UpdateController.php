<?php

namespace App\Http\Controllers\Tariff\TariffAttribute;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Tariff\TariffAttribute;
use App\Http\Requests\Tariff\Attribute\UpdateTariffAttributeRequest;
use App\Http\Resources\Tariff\Attribute\IndexTariffAttributeResource;

class UpdateController extends Controller
{
    public function __invoke(UpdateTariffAttributeRequest $request, $id)
    {
        try {
            DB::beginTransaction();

            if(!$id){
                throw new \Exception('Tariff Attribute Id not exist.');
            }

            $tariffAttribute = TariffAttribute::findOrFail($id);

            if(!$tariffAttribute){
                throw new \Exception('Tariff Attribute not found.');
            }

            $data = $request->validated();
            $currentUserId = Auth::id();
            $updateData = [];

            // Nur geänderte Hauptfelder aktualisieren
            $fillableFields = [
                'code',
                'input_type_id',
                'is_frontend_visible',
                'is_required',
                'is_system',
                'name',
                'unit'
            ];

            foreach ($fillableFields as $field) {
                if ($request->has($field)) {
                    $updateData[$field] = $data[$field];
                }
            }

            // Immer updated_by setzen, wenn vorhanden
            $updateData['updated_by'] = $currentUserId;

            if (!empty($updateData)) {
                $tariffAttribute->update($updateData);
            }

            // Details nur aktualisieren, wenn im Request enthalten
            if ($request->has('details')) {
                $tariffAttribute->details = json_encode($data['details']);
                $tariffAttribute->save();
            }

            // Tariff Groups nur aktualisieren, wenn im Request enthalten
            if ($request->has('tariff_groups')) {
                $tariffGroups = [];
                foreach ($data['tariff_groups'] as $group) {
                    if ($group['checked']) {
                        $tariffGroups[] = $group['id'];
                    }
                }
                $tariffAttribute->tariffGroups()->sync($tariffGroups);
            }

            DB::commit();
            return new IndexTariffAttributeResource($tariffAttribute->fresh()->load('tariffGroups'));
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