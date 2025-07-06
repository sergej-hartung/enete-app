<?php

namespace App\Services\Pdf;

use App\Services\Pdf\Base\MpdfEngine;
use App\Services\Pdf\Base\FpdfEngine;
use App\Services\Pdf\Templates\PdfOfferTemplate;

class OfferPdfService
{
    public function generate(OfferData $data): string
    {
        $template = new PdfOfferTemplate($data);
        $pdfEngine = new MpdfEngine($template, $data); // später austauschbar

        $pdfEngine->addCover();
        $pdfEngine->addOffers();
        $pdfEngine->addSummary();

        return $pdfEngine->output(); // Gibt Pfad oder PDF-Stream zurück
    }
}