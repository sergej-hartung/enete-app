<?php
namespace App\Services\Pdf\Builder\Page;

use setasign\Fpdi\Fpdi;
use App\Services\Pdf\Template\PdfOfferTemplate;
use App\Services\Pdf\Dto\OfferData;

final class LastPage
{
    public function __construct(
        private Fpdi             $pdf,
        private PdfOfferTemplate $tpl,
        private OfferData        $data   // momentan nicht genutzt
    ){}

    public function draw(): void
    {
        $p = $this->pdf;
        $title = 'Wie geht es weiter?';
        $items = $this->tpl->getLastSteps();
        $check = $this->tpl->getCheckmarkPath();

        $p->AddPage();

        /* Kopf‑Balken */
        $p->SetFillColor(125,22,33);
        $p->SetY(47); $p->SetX(7);
        $p->Cell(155,24,'',0,0,'',true);

        $p->AddFont('Raleway','','Raleway-Regular.php');
        $p->SetFont('Raleway','',30);
        $p->SetTextColor(255,255,255);
        $p->SetY(55); $p->SetX(29);
        $p->Cell(0,5,iconv('UTF-8','CP1252//TRANSLIT',$title));

        /* Check‑Liste 2‑spaltig */
        $p->SetY(104);
        $p->SetFont('Raleway','',14);
        $p->SetTextColor(0,0,0);

        // links (0‑4)
        foreach (array_slice($items,0,5) as $txt){
            $y=$p->GetY();
            $p->Image($check,18,$y+1,3);
            $p->SetX(25);
            $p->MultiCell(80,7,iconv('UTF-8','CP1252//TRANSLIT',$txt));
            $p->Ln(4);
        }

        // rechts (Rest)
        $p->SetY(104);
        foreach (array_slice($items,5) as $txt){
            $y=$p->GetY();
            $p->Image($check,113,$y+1,3);
            $p->SetXY(120,$y);
            $p->MultiCell(80,7,iconv('UTF-8','CP1252//TRANSLIT',$txt));
            $p->Ln(4);
        }
    }
}