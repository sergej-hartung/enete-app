<?php

namespace App\Http\Controllers\Tariff\TariffSortingCriteria;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Tariff\TariffSortingCriteria;
use App\Http\Requests\Tariff\SortingCriteria\UpdateSortingCriteriaRequest;
use App\Http\Resources\Tariff\Sorting\IndexTariffSortingResource;

class UpdateController extends Controller
{
    public function __invoke(UpdateSortingCriteriaRequest $request, $id)
    {
        try {
            DB::beginTransaction();

            if(!$id){
                throw new \Exception('Tariff Sorting Criteria Id not exist.');
            }

            $tariffSortingCriteria = TariffSortingCriteria::findOrFail($id);

            if(!$tariffSortingCriteria){
                throw new \Exception('Tariff Sorting Criteria not found.');
            }

            $data = $request->validated();
            $currentUserId = Auth::id();
            $updateData = [];

            // Nur geänderte Hauptfelder aktualisieren
            $fillableFields = [
                'name',
                'description',
            ];

            foreach ($fillableFields as $field) {
                if ($request->has($field)) {
                    $updateData[$field] = $data[$field];
                }
            }

            // Immer updated_by setzen, wenn vorhanden
            $updateData['updated_by'] = $currentUserId;

            if (!empty($updateData)) {
                $tariffSortingCriteria->update($updateData);
            }


            // Tariff Groups nur aktualisieren, wenn im Request enthalten
            if ($request->has('tariff_groups')) {
                $tariffGroups = [];
                foreach ($data['tariff_groups'] as $group) {
                    if ($group['checked']) {
                        $tariffGroups[] = $group['id'];
                    }
                }
                $tariffSortingCriteria->groups()->sync($tariffGroups);
            }

            DB::commit();
            return new IndexTariffSortingResource($tariffSortingCriteria->fresh()->load(['groups']));
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