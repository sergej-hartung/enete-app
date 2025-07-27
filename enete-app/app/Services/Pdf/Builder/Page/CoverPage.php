<?php
namespace App\Services\Pdf\Builder\Page;

use setasign\Fpdi\Fpdi;
use App\Services\Pdf\Template\PdfOfferTemplate;
use App\Services\Pdf\Dto\OfferData;

final class CoverPage
{
    public function __construct(
        private Fpdi             $pdf,
        private PdfOfferTemplate $tpl,
        private OfferData        $data
    ){}

    public function draw(): void
    {
        $p = $this->pdf;
        $t = $this->tpl;
        $d = $this->data;

        /* Header‑Parameter für Seite 1 */
        $p->params = [
            'logo'      => $t->getLogoPath(),
            'checkmark' => $t->getCheckmarkPath(),
            'seller'    => $d->seller,
            'client'    => $d->client,
            'company'   => $t->getCompany(),
        ];

        $p->AddPage();

        /* Titel */
        $p->SetFont('Raleway','',23.5);
        $p->SetTextColor(124,22,32);
        $p->SetY(114);
        $p->Cell(0,10,iconv('UTF-8','CP1252//TRANSLIT',$t->getEnergyTitle($d->branch)),0,1,'L');
        
        $p->SetTextColor(129,129,129);
        $p->Cell(0,10,now()->format('d.m.Y | H:i:s'),0,1,'L');
        $p->Ln(5);

        /* Anschreiben */
        $p->SetFont('Raleway','',11);
        $p->SetTextColor(0,0,0);
        $letter = $t->energyLetter($d->client,$d->ratesData);
        $p->MultiCell(0,6,iconv('UTF-8','CP1252//TRANSLIT',$letter),0,'L');
        $p->Ln(8);
        /* Gruß */
        $p->SetFont('Raleway','',11);
        $p->Cell(0,6,'enete GmbH',0,1,'L');
        $p->SetFont('Raleway','I',11);
        $p->Cell(0,6,iconv('UTF-8','CP1252//TRANSLIT',$t->getCompanyDescription()),0,1,'L');
    }
}