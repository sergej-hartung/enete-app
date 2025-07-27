<?php

namespace App\Services\Pdf\Contracts;

use App\Services\Pdf\Dto\OfferData;

interface PdfRendererInterface
{
    /** Liefert den absolut gespeicherten Dateipfad des PDFs zurück. */
    public function render(OfferData $data): string;
}