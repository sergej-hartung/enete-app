<?php

namespace App\Http\Controllers\Tariff;

use App\Models\User\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tariff\TariffRequest;
use App\Services\TariffService;
use Illuminate\Support\Facades\DB;

class TariffStoreController extends Controller
{
     protected $tariffService;

    public function __construct(TariffService $tariffService)
    {
        $this->tariffService = $tariffService;
    }

    public function __invoke(TariffRequest $request)
    {
        try {
            DB::beginTransaction();
                $this->tariffService->createTariff($request, $request->validated());
            // $this->userProfileService->createEmployeeProfile($request, $request->validated());

            DB::commit();
            return response('', 201);
        } catch (\Exception $exception) {
            DB::rollBack();   
  
            //$this->userProfileService->cleanupUploadedFiles();

            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}