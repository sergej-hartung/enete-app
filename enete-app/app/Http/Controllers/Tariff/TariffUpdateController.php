<?php

namespace App\Http\Controllers\Tariff;

use App\Http\Controllers\Controller;
use App\Services\TariffService;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\Tariff\TariffUpdateRequest;
use App\Http\Resources\Tariff\ShowTariffResource;

class TariffUpdateController extends Controller
{
    protected $tariffService;

    public function __construct(TariffService $tariffService)
    {
        $this->tariffService = $tariffService;
    }

    public function __invoke(TariffUpdateRequest $request, $tarifId)
    {
        try {
            DB::beginTransaction();
                $tariff = $this->tariffService->updateTariff($request, $request->validated(), $tarifId);
            
            DB::commit();
            return new ShowTariffResource($tariff);
        } catch (\Exception $exception) {
            DB::rollBack();   

            return response()->json(['error' => $exception->getMessage()], 500);
        }
        
    }

}