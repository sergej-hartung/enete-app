<?php

namespace App\Http\Controllers\Tariff\TariffAttribute;

use App\Models\User\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tariff\Attribute\StoreTariffAttributeRequest;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Tariff\TariffAttribute;

class StoreController extends Controller
{
    protected $tariffService;

   

    public function __invoke(StoreTariffAttributeRequest $request)
    {
        try {
            DB::beginTransaction();

                $data = $request->validated();
                $currentUserId = Auth::id();

                // Erstelle das Haupt-Attribut
                $attribute = TariffAttribute::create([
                    'code' => $data['code'],
                    'input_type_id' => $data['input_type_id'],
                    'is_frontend_visible' => $data['is_frontend_visible'], // Typo im Original korrigiert
                    'is_required' => $data['is_required'],
                    'is_system' => $data['is_system'],
                    'name' => $data['name'],
                    'unit' => $data['unit'],
                    'created_by' => $currentUserId,
                ]);

                // Speichere die Details als JSON oder in separater Tabelle
                if (!empty($data['details'])) {
                    $attribute->details = json_encode($data['details']);
                    $attribute->save();
                }

                // Verarbeite tariff_groups
                if (!empty($data['tariff_groups'])) {
                    $tariffGroups = [];
                    foreach ($data['tariff_groups'] as $group) {
                        if ($group['checked']) {
                            $tariffGroups[] = $group['id'];
                        }
                    }
                    $attribute->tariffGroups()->sync($tariffGroups);
                }

            DB::commit();
            return response('', 201);
        } catch (\Exception $exception) {
            DB::rollBack();   

            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}