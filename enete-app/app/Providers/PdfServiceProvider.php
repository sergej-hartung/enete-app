<?php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Pdf\Contracts\PdfRendererInterface;
use App\Services\Pdf\Renderer\FpdfRenderer;

class PdfServiceProvider extends ServiceProvider
{
    // public function register(): void
    // {
    //     $this->app->bind(PdfRendererInterface::class, function () {
    //         // später leicht austauschbar gegen MpdfRenderer
    //         return new FpdfRenderer();
    //     });
    // }

    public function register(): void
    {
        $this->app->bind(PdfRendererInterface::class, function () {
            $engine = request()->input('engine')            // URL‑Parameter?
                    ?? session('pdf_engine')               // oder Session?
                    ?? config('pdf.engine', 'fpdf');       // Fallback

            return $engine === 'mpdf'
                ? new MpdfRenderer()
                : new FpdfRenderer();
        });
    }
}