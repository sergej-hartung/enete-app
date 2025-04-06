<?php

namespace App\Http\Controllers\Tariff\TariffNetworkOperator;

use App\Models\User\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tariff\NetworkOperator\StoreNetworkOperatorRequest;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Tariff\TariffNetworkOperator;

class StoreController extends Controller
{
    protected $tariffService;

   

    public function __invoke(StoreNetworkOperatorRequest $request)
    {
        try {
            DB::beginTransaction();
                //var_dump($request->validated());
                $data = $request->validated();
                $currentUserId = Auth::id();

                $networkOperator = TariffNetworkOperator::create([
                    'name' => $data['name'],
                    'logo_id' => $data['logo_id'],
                    'created_by' => $currentUserId,
                ]);

                // Verarbeite tariff_groups
                if (!empty($data['tariff_groups'])) {
                    $tariffGroups = [];
                    foreach ($data['tariff_groups'] as $group) {
                        if ($group['checked']) {
                            $tariffGroups[] = $group['id'];
                        }
                    }
                    $networkOperator->groups()->sync($tariffGroups);
                }

            DB::commit();
            return response('', 201);
        } catch (\Exception $exception) {
            DB::rollBack();   

            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}