<?php 

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\Pdf\PdfRenderService;

class PdfTestController extends Controller
{
    public function test(Request $request, PdfRenderService $pdfService)
    {
        $offerData = $request->input('offerData');

        try {
            $path = $pdfService->render($offerData);
            return response()->download($path);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}