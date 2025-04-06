<?php

namespace App\Http\Controllers\Tariff\TariffProvider;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Tariff\TariffProvider;
use App\Http\Requests\Tariff\Provider\UpdateTariffProviderRequest;
use App\Http\Resources\Tariff\Provider\IndexTariffProviderResource;

class UpdateController extends Controller
{
    public function __invoke(UpdateTariffProviderRequest $request, $id)
    {
        try {
            DB::beginTransaction();

            if(!$id){
                throw new \Exception('Tariff Provider Id not exist.');
            }

            $tariffProvider = TariffProvider::findOrFail($id);

            if(!$tariffProvider){
                throw new \Exception('Tariff Provider not found.');
            }

            $data = $request->validated();
            $currentUserId = Auth::id();
            $updateData = [];

            // Nur geänderte Hauptfelder aktualisieren
            $fillableFields = [
                'external_fill_link',
                'is_filled_on_site',
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
                $tariffProvider->update($updateData);
            }


            // Tariff Groups nur aktualisieren, wenn im Request enthalten
            if ($request->has('tariff_groups')) {
                $tariffGroups = [];
                foreach ($data['tariff_groups'] as $group) {
                    if ($group['checked']) {
                        $tariffGroups[] = $group['id'];
                    }
                }
                $tariffProvider->groups()->sync($tariffGroups);
            }

            DB::commit();
            return new IndexTariffProviderResource($tariffProvider->fresh()->load(['groups', 'document']));
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