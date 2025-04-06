<?php

namespace App\Http\Controllers\Tariff\TariffProvider;

use App\Models\User\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tariff\Provider\StoreTariffProviderRequest;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Tariff\TariffProvider;

class StoreController extends Controller
{
    protected $tariffService;

   

    public function __invoke(StoreTariffProviderRequest $request)
    {
        try {
            DB::beginTransaction();
                //var_dump($request->validated());
                $data = $request->validated();
                $currentUserId = Auth::id();

                $provider = TariffProvider::create([
                    'name' => $data['name'],
                    'logo_id' => $data['logo_id'],
                    'is_filled_on_site' => $data['is_filled_on_site'],
                    'external_fill_link' => $data['external_fill_link'],
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
                    $provider->groups()->sync($tariffGroups);
                }

            DB::commit();
            return response('', 201);
        } catch (\Exception $exception) {
            DB::rollBack();   

            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}