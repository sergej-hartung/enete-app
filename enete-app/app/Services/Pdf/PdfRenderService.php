<?php

namespace App\Services\Pdf;

class PdfRenderService
{
    protected PdfRendererInterface $renderer;

    public function __construct()
    {
        $engine = config('pdf.engine', 'mpdf');

        $this->renderer = match ($engine) {
            'fpdf' => new FpdfRenderer(),
            'mpdf' => new MpdfRenderer(),
            default => throw new \Exception("Unbekannte PDF-Engine: $engine")
        };
    }

    public function render(array $offerData): string
    {
        return $this->renderer->render($offerData);
    }
}