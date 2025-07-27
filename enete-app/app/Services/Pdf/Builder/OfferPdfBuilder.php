<?php

namespace App\Services\Pdf\Builder;

use setasign\Fpdi\Fpdi;
use App\Services\Pdf\Document\PdfDocument;
use App\Services\Pdf\Dto\OfferData;
use App\Services\Pdf\Template\PdfOfferTemplate;
use App\Services\Pdf\Builder\Page\CoverPage;
use App\Services\Pdf\Builder\Page\ComparisonPage;
use App\Services\Pdf\Builder\Page\LastPage;

class OfferPdfBuilder
{
    private readonly PdfDocument     $pdf;    // statt Fpdi
    private readonly PdfOfferTemplate $tpl;

    public function __construct()
    {
        if (!defined('FPDF_FONTPATH')) {
            define('FPDF_FONTPATH', base_path('resources/fonts/fpdf/'));
        }

        $this->pdf = new PdfDocument('P', 'mm', 'A4');
        $this->pdf->SetAutoPageBreak(false);
        $this->pdf->SetMargins(17, 7, 17);
        $this->pdf->AddFont('Raleway', '', 'Raleway-Regular.php');
        $this->pdf->AddFont('Raleway', 'B', 'Raleway-Bold.php');
        $this->pdf->AddFont('Raleway', 'I', 'Raleway-Italic.php');

        $this->tpl = new PdfOfferTemplate();
    }

    public function build(OfferData $d): Fpdi
    {
        /* ==== Seite 1 ==== */
        (new CoverPage($this->pdf, $this->tpl, $d))->draw();

        /* ==== Vergleichs­seiten ==== */
        foreach ($d->offers as $idx => $offer) {
            (new ComparisonPage($this->pdf, $this->tpl, $d, $offer, $idx+1))->draw();
        }

        /* ==== Schlussseite ==== */
        (new LastPage($this->pdf, $this->tpl, $d))->draw();

        return $this->pdf;
    }
}