<?php

namespace App\Services\Pdf;

if (!defined('FPDF_FONTPATH')) {
    define('FPDF_FONTPATH', base_path('resources/fonts/fpdf/'));
}

use setasign\Fpdi\Fpdi;
use App\Services\Pdf\Base\OfferPdf;
use App\Services\Pdf\Templates\PdfOfferTemplate;

class FpdfRenderer implements PdfRendererInterface
{
    private PdfOfferTemplate $template;
    private array $params;        // Logo, seller, client, company

 
    public function render(array $data): string
    {
        $this->template = new PdfOfferTemplate();

        /* Parameter-Array für Header setzen */
        $this->params = [
            'logo'   => $this->template->getLogoPath(),
            'seller' => $data['seller'],
            'client' => $data['client'],
            'company'=> $this->template->getCompany()
        ];

        $this->params['disclaimer'] = $this->template->getEnergyOfferTextTariff();
        $this->params['lastPage'] = [
            'title' => 'Wie geht es weiter?',
            'items' => [
                'Sie erhalten ein nach den Angebotsangaben ausgefülltes Auftragsformular zur Unterschrift.',
                'Mit Ihrer Unterschrift erteilen Sie uns den Auftrag.',
                'Wir kümmern uns ab sofort um alle Formalitäten und leiten den Wechsel ein.',
                'Der neue Anbieter kündigt Ihren bestehenden Vertrag und meldet Sie beim Netzbetreiber um.',
                'Der Wechselprozess dauert nur wenige Wochen. Für den gesamten Wechselprozess sollten Sie in der Regel vier bis sechs Wochen einkalkulieren.',
                'Sobald alle Bestätigungen vorliegen, erhalten Sie ein Begrüßungsschreiben. Darin teilt Ihnen der neue Versorger mit, ab wann Sie beliefert werden.',
                'Fotografieren Sie am besten Ihren Zählerstand am Tag der Umstellung.',
                'Unser Service ist 100 % kostenfrei für Sie! Wir möchten Sie auch bei Ihrem nächsten Wechsel betreuen.'
            ]
            ];
        $this->params['checkmark'] = $this->template->getCheckmarkPath();

        $branch = $data['ratesData']['branch'] ?? 'electric';
        $angebot = $branch === 'electric' ? 'Stromangebot' : 'Gasangebot';

        $pdf = new OfferPdf();
        $pdf->params = $this->params;   // → Header erhält Daten

        /* Fonts einmal registrieren */
        $pdf->AddFont('Raleway','','Raleway-Regular.php');
        $pdf->AddFont('Raleway','B','Raleway-Bold.php');
        $pdf->AddFont('Raleway','I','Raleway-Italic.php');

        /* ---------------- Seite 1 ---------------- */
        $pdf->AddPage(); 
 
        /* ===== TITELBLOCK ===== */
        $pdf->SetFont('Raleway','',23.5);
        $pdf->SetTextColor(124,22,32);                  // Rot
        $pdf->SetY(114);
        $pdf->Cell(0,10,
            iconv('UTF-8','CP1252//TRANSLIT',"Ihr persönliches $angebot vom"),
            0,0,'L');
        $pdf->Ln();

        $pdf->SetTextColor(129,129,129);                // Grau
        $pdf->Cell(0,10,date('d.m.Y | H:i:s'),0,0,'L');
        $pdf->Ln(19);            

        /* ===== Anschreiben (EnergyText) ===== */
        $pdf->SetFont('Raleway','',11);
        $pdf->SetTextColor(0,0,0);

        $letter = $this->template->energyLetter(
                    $data['client'],
                    $data['ratesData']
                );

        $pdf->MultiCell(
            0, 6,
            iconv('UTF-8','CP1252//TRANSLIT', $letter),
            0, 'L'
        );
        /* Signatur */
        $pdf->Ln(8);
        $pdf->SetFont('Raleway','',11);
        $pdf->SetTextColor(0,0,0);
        $pdf->Cell(0,6,'enete GmbH');
        $pdf->Ln(5);
        $pdf->SetFont('Raleway','I',11);
        $pdf->SetTextColor(0,0,0);
        $pdf->Cell(
            0,6,
            iconv('UTF-8','CP1252//TRANSLIT',$this->template->getCompanyDescription())
        );
        
        // -------- Preisvergleich-Seite(n) --------
        foreach ($data['offers'] as $idx => $offer) {
            $pdf->addPriceComparisonPage(
                $idx+1,
                $offer,
                $data['ratesData'],
                $data['filterData']
            );
        }
        /* ---- weitere Seiten folgen Schritt 2 / 3 ---- */
        $pdf->addLastPage();  

        $path = storage_path('app/pdfs/fpdf_deckblatt.pdf');
        $pdf->Output('F',$path);
        return $path;
    }
}