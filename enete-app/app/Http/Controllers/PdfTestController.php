<?php 

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\Pdf\Contracts\PdfRendererInterface;
use App\Services\Pdf\Dto\OfferData;
//use App\Services\Pdf\PdfRenderService;

class PdfTestController extends Controller
{

    public function test(Request $request, PdfRendererInterface $renderer)
    {
        try {
            $data = new OfferData(...$request->input('offerData', []));
            $path = $renderer->render($data);

            return response()->download($path)->deleteFileAfterSend(true);
        } catch (\Throwable $e) {
            report($e);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}