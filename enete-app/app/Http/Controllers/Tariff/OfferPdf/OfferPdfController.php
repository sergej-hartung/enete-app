<?php

namespace App\Http\Controllers\Tariff\OfferPdf;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\Tariff\OfferPdf\OfferPdfRequest;
use App\Services\Pdf\Contracts\PdfRendererInterface;
use App\Services\Pdf\Dto\OfferData;

use App\Http\Controllers\Controller;
/**
 * Stellt 1 Endpoint bereit:
 *   POST /api/pdf/offer
 * Erwartet die Struktur aus OfferPdfRequest
 * und liefert das generierte PDF als Download.
 */
final class OfferPdfController extends Controller
{
    public function __invoke(
        OfferPdfRequest       $request,
        PdfRendererInterface  $renderer         // wird via Service‑Provider injiziert
    ): Response {
        try {
            /* ---------------- Daten DTO ---------------- */
            $data = new OfferData(...$request->validated()['offerData']);

            /* ---------------- Rendern ------------------ */
            $path = $renderer->render($data);

            /* ---------------- Download ----------------- */
            return response()
                ->download($path)
                ->deleteFileAfterSend(true);    // Temp‑Datei aufräumen
        } catch (\Throwable $e) {
            Log::error('PDF‑Generierung fehlgeschlagen', ['msg' => $e->getMessage()]);
            return response()->json(
                ['error' => 'PDF konnte nicht erstellt werden.'],
                500
            );
        }
    }
}