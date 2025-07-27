<?php
namespace App\Services\Pdf\Builder\Page;

use setasign\Fpdi\Fpdi;
use App\Services\Pdf\Template\PdfOfferTemplate;
use App\Services\Pdf\Dto\OfferData;

/**
 * zeichnet **eine** Vergleichsseite (Preisvergleich 1, 2, …)
 */
final class ComparisonPage
{
    private Fpdi             $pdf;
    private PdfOfferTemplate $tpl;
    private OfferData        $data;
    private array            $offer;
    private int              $no;          // 1‑based

    private float $currentYRight = 0;

    private string $euro;


    public function __construct(
        Fpdi             $pdf,
        PdfOfferTemplate $tpl,
        OfferData        $data,
        array            $offer,
        int              $no
    ) {
        $this->pdf   = $pdf;
        $this->tpl   = $tpl;
        $this->data  = $data;
        $this->offer = $offer;
        $this->no    = $no;

        $this->euro  = iconv('UTF-8','CP1252','€');
    }

    /* ----------------------------------------------------------- */
    public function draw(): void
    {
        $p = $this->pdf;
        $p->AddPage();

        /* ------- zwei Info‑Blöcke oben (links Kunde, rechts Hinweis) ------- */
        $this->drawOfferDataBlock();
        $this->drawInformationBlock();

        /* ------- Rahmen & Überschrift ------- */
        $this->drawComparisonFrame();
        $p->SetY(72);
        $p->SetFont('Raleway','',17.5);
        $p->SetTextColor(125,22,33);
        $p->Cell(0,10,"Preisvergleich {$this->no} |",0,1,'L');

        /* ------- Daten vorbereiten ------- */
        $cur = $this->prepareCurrentProvider();
        $sw  = $this->prepareSwitchProvider($cur['totalPrice']);

        /* ------- linke + rechte Vergleichsbox ------- */
        $this->drawCurrentProviderBlock($cur);
        $this->drawSwitchProviderBlock($sw);

        /* ------- Disclaimer unterm Rahmen ------- */
        $this->drawTariffDisclaimer();
    }

    /* ================ Hilfs‑Blöcke ================= */

    private function drawOfferDataBlock(): void
    {
        $p = $this->pdf;
        $cli = $this->data->client;
        $rates = $this->data->ratesData;

        $p->SetY(30);
        $p->AddFont('Raleway','','Raleway-Regular.php');
        $p->AddFont('Raleway','B','Raleway-Bold.php');

        /* Überschrift */
        $p->SetFont('Raleway','',17.5);
        $p->SetTextColor(125,22,33);
        $p->Cell(0,13,'Ihre Angebotsdaten',0,1,'L');

        /* Kunde */
        $p->SetFont('Raleway','',11.5);
        $p->SetTextColor(123,123,123);
        $p->Cell(30,5,'Kunde:',0,0,'L');

        $p->SetFont('Arial','B',11);
        $kunde = trim(($cli['salutation'] ?? '').' '.($cli['firstName'] ?? '').' '.($cli['lastName'] ?? ''));
        $p->MultiCell(0,5,iconv('UTF-8','CP1252//TRANSLIT',$kunde));
        $p->Ln(1);

        /* Verbrauch */
        $p->SetFont('Raleway','',11.5);
        $p->SetTextColor(123,123,123);
        $p->Cell(30,10,'Verbrauch:',0,0,'L');

        $p->SetFont('Arial','B',11);
        $p->Cell(0,10,($rates['consum'] ?? '').' kWh');
        $p->Ln(8);

        if (!empty($rates['consumNt'])) {
            $p->SetFont('Raleway','',11.5);
            $p->SetTextColor(123,123,123);
            $p->Cell(30,10,'Verbrauch NT:',0,0,'L');

            $p->SetFont('Arial','B',11);
            $p->Cell(0,10,$rates['consumNt'].' kWh');
            $p->Ln(8);
        }
    }

    private function drawInformationBlock(): void
    {
        $p = $this->pdf;
        $p->SetY(30);
        $p->SetX(-103);

        $p->AddFont('Raleway','','Raleway-Regular.php');
        $p->SetFont('Raleway','',17.5);
        $p->SetTextColor(125,22,33);
        $p->setCellMargin(3);

        $p->SetDrawColor(217,217,217);
        $p->Cell(85,13,'Zur Information','LTR',1,'L');


        /* Text: Preise brutto/netto */
        $type    = $this->data->ratesData['type'] ?? 'private';
        $suffix  = $type === 'company' ? 'netto.' : 'brutto.';
        $text    = 'Die angegebenen Preise sind '.$suffix;

        
        $p->SetFont('Raleway','',10);
        $p->SetTextColor(123,123,123);
        $p->SetX(-103);
        $p->MultiCell(85,7,iconv('UTF-8','CP1252//TRANSLIT',$text),'LBR','L');
    }

    /* ----- Rahmen ----- */
    private function drawComparisonFrame(): void
    {
        $p = $this->pdf;
        $p->SetY(90);

        $p->SetFillColor(230,231,233);           // grau links
        $p->Cell(85,167,'',0,0,'',true);

        $p->SetX(-103);
        $p->SetFillColor(157,27,39);             // rot rechts oben
        $p->Cell(85,143,'',0,0,'',true);

        $p->SetY(232);
        $p->SetX(-103);
        $p->SetFillColor(125,22,33);             // rot rechts unten
        $p->Cell(85,25,'',0,0,'',true);
    }

    /* ----- Datenaufbereitung ----- */
    private function prepareCurrentProvider(): array
    {
        $r = $this->data->ratesData;

        $work       = (float)($r['workPrice']    ?? 0);
        $workNt     = (float)($r['workPriceNt']  ?? 0);
        $baseYear   = (float)($r['basePriceYear']?? 0);
        $consum     = (int)  ($r['consum']       ?? 0);
        $consumNt   = (int)  ($r['consumNt']     ?? 0);

        $total = $baseYear + ($work * $consum)/100;
        if ($workNt && $consumNt) {
            $total += ($workNt * $consumNt)/100;
        }

        $providerName = $r['providerName']['providerName']
                        ?? $r['providerName']
                        ?? '';

        return [
            'providerName' => $providerName,
            'basePriceYear'=> $baseYear,
            'workPrice'    => $work,
            'workPriceNt'  => $workNt,
            'totalPrice'   => round($total,2),
        ];
    }

    private function prepareSwitchProvider(float $totalCur): array
    {
        $o = $this->offer;

        return [
            'providerName'             => $o['providerName'] ?? '',
            'basePriceYear'            => (float)$o['basePriceYear'],
            'workPrice'                => (float)$o['workPrice'],
            'workPriceNt'              => (float)$o['workPriceNt'],
            'totalPrice'               => (float)$o['totalPrice'],
            'totalPriceWithoutBonus'   => (float)$o['totalPriceWithoutBonus'],
            'partialPayment'           => (int)  $o['partialPayment'],
            'optGuarantee'             => (int)  $o['optGuarantee'],
            'optGuaranteeType'         => $o['optGuaranteeType'] ?? '',
            'optTerm'                  => (int)  $o['optTerm'],
            'treueBonus'               => floatval($o['optBonus']),
            'wilkommensBonus'          => floatval($o['optBonusInstant']),
            'bleibeBonus'              => floatval($o['optBonusLoyalty']),
            'totalPriceCurrentProvider'=> $totalCur,
        ];
    }

    /* ----- linker Kasten ----- */
    private function drawCurrentProviderBlock(array $c): void
    {
        $p = $this->pdf;
        $p->SetY(96); $p->SetX(25);

        /* Überschrift */
        $p->SetFont('Raleway','',14);
        $p->SetTextColor(125,22,33);
        $p->Cell(69,5,'Ihr aktueller Anbieter:');
        $p->Ln(12);

        /* Providername */
        if ($c['providerName']) {
            $p->SetY(108);
            $p->SetX(25);
            $p->SetFont('Raleway','B',15);
            $p->MultiCell(69,8,iconv('UTF-8','CP1252//TRANSLIT',$c['providerName']),0,'L');
            $p->Ln(6);
        }

        $p->SetFont('Arial','',10);
        $p->SetTextColor(0,0,0);

        /* Grundpreis Monat */
        if ($c['basePriceYear']) {
            $p->SetY(130);
            $p->SetX(25); 
            $p->Cell(40,5,'Grundpreis Monat:');
            $p->SetFont('Arial','B',12);
            $p->Cell(15,5,number_format($c['basePriceYear']/12,2,'.','').' '.$this->euro);
            $p->Ln(8);
            $p->SetFont('Arial','',10);
        }

        /* Arbeitspreis(e) */
        if ($c['workPrice']) {
            $p->SetX(25);
            $p->Cell(40,5,'Arbeitspreis kWh:');
            $p->SetFont('Arial','B',12);
            $p->Cell(15,5,number_format($c['workPrice'],2,'.','').' ct.');
            $p->Ln(8);
            $p->SetFont('Arial','',10);
        }
        if ($c['workPriceNt']) {
            $p->SetX(25);
            $p->Cell(40,5,'Arbeitspreis NT kWh:');
            $p->SetFont('Arial','B',12);
            $p->Cell(15,5,number_format($c['workPriceNt'],2,'.','').' ct.');
            $p->Ln(8);
            $p->SetFont('Arial','',10);
        }

        /* Trennlinie */
        $y = $p->GetY()+2;
        $p->SetDrawColor(255,255,255);
        $p->Line(25,$y,94,$y); $p->Ln(7);

        /* Gesamtkosten */
        $p->SetX(25);
        $p->SetFont('Arial','B',11);
        $p->Cell(69,5,'Gesamtkosten pro Jahr:',0,1,'C');
        $p->Ln(5);

        if($c['totalPrice']){
            $p->SetX(25);
            $p->SetFont('Arial','B',24);
            $p->Cell(69,9,number_format($c['totalPrice'],2,'.','').' '.$this->euro,0,1,'C');
        }
        

        $y = $p->GetY()+19;
        $p->SetDrawColor(255,255,255);
        $p->Line(25,$y,94,$y); $p->Ln(7);
    }

    /* ----- rechter Kasten ----- */
    private function drawSwitchProviderBlock(array $s): void
    {
        $p = $this->pdf;
        $hide = $this->data->client['providerNameHiden'] ?? false;

        $p->SetY(96); 
        $p->SetX(-95);

        

        $p->SetFont('Raleway','',14);
        $p->SetTextColor(255,255,255);
        $p->Cell(69,5,'Unser Angebot:');
        $p->Ln(12);

        if ($s['providerName'] && !$hide) {
            $p->SetY(108);
            $p->SetX(-95);
            $p->SetFont('Raleway','B',15);
            $p->MultiCell(69,8,iconv('UTF-8','CP1252//TRANSLIT',$s['providerName']),0, 'L');
            $p->Ln(8);
        } else {
            $p->SetFont('Raleway','B',15);
            $p->SetX(-95);
            $p->MultiCell(
                69,8,
                iconv('UTF-8','CP1252//TRANSLIT',''),
                0,'L'
            );
            $p->Ln(8);
        }

        /* Preis‑Details */
        $p->SetY(130);
        $p->SetX(-95);
        $p->SetFont('Arial','',10);
        $p->Cell(40,5,'Grundpreis Monat:');
        $p->SetFont('Arial','B',12);
        $p->Cell(15,5,number_format($s['basePriceYear']/12,2,'.','').' '.$this->euro);
        $p->Ln(8);

        $p->SetFont('Arial','',10);
        $p->SetX(-95);
        $p->Cell(40,5,'Arbeitspreis kWh:');
        $p->SetFont('Arial','B',12);
        $p->Cell(15,5,number_format($s['workPrice'],2,'.','').' ct.');
        $p->Ln(8);

        if ($s['workPriceNt']) {
            $p->SetX(-95);
            $p->SetFont('Arial','',10);
            $p->Cell(40,5,'Arbeitspreis NT kWh:');
            $p->SetFont('Arial','B',12);
            $p->Cell(15,5,number_format($s['workPriceNt'],2,'.','').' ct.');
            $p->Ln(8);
        }

        
        /* -----------------------------------------------------------
        *  Boni – Treue‑, Willkommens‑, Bleibe‑Bonus
        * ---------------------------------------------------------- */
        
        foreach (['treueBonus'=>'Treue-Bonus:','wilkommensBonus'=>'Willkommensbonus:','bleibeBonus'=>'Bleibe-Bonus:'] as $k=>$label) {
            if ($s[$k]>0 && ($filterData['filterBonus'] ?? true)) {
                $p->SetFont('Arial','',10);
                $p->SetX(-95); 
                $p->Cell(40,5,$label,0,0,'L');
                $p->SetFont('Arial','B',12);
                $p->Cell(15,5,number_format($s[$k],2,'.','').' '.$this->euro,0,0,'L');
                $p->Ln(8);
            }
        }

        /* Trennlinie */
        $p->SetX(-95);
        $y = $p->GetY()+2;
        $p->SetDrawColor(255,255,255);
        $p->Line($p->GetX(),$y,$p->GetX()+69,$y);
        $p->Ln(8);

        $this->currentYRight = $p->GetY();

        /* Gesamtkosten */
        $p->SetX(-95);
        $p->SetFont('Arial','B',11);
        $p->Cell(69,5,'Gesamtkosten pro Jahr:',0,1,'C');
        $p->Ln(5);

        $p->SetX(-95);
        $p->SetFont('Arial','B',24);
        $p->Cell(69,9,number_format($s['totalPriceWithoutBonus'],2,'.','').' '.$this->euro,0,1,'C');
        $p->Ln(5);

        /* Monatsabschlag */
        if ($s['partialPayment']) {
            $mon = $s['totalPriceWithoutBonus'] / $s['partialPayment'];
            $p->SetX(-95);
            $p->SetFont('Arial','',13);
            $p->Cell(69,6,'ca. '.number_format($mon,2,'.','').' '.$this->euro.' / mtl.',0,1,'C');
            $p->Ln(5);
        }

        /* untere Linie */
        // $p->SetY($this->currentYRight + 38);
        // $p->SetX(-95);
        // $p->SetFillColor(255,255,255);
        // $p->Cell(69,0.5,'',0,1,'L',true);
        // $p->Ln(5);

        $p->SetX(-95);
        $y = $p->GetY()+2;
        $p->SetDrawColor(255,255,255);
        $p->Line($p->GetX(),$y,$p->GetX()+69,$y);
        $p->Ln(8);

        /* -----------------------------------------------------------
        *  Garantien & Vertragslaufzeit
        * ---------------------------------------------------------- */
        $p->SetFont('Arial','I',10);
        $p->SetX(-95);

        /* Garantiebezeichnung auswählen */
        $gLbl = match ($s['optGuaranteeType']) {
            'energyPrice'         => 'Energiepreisgarantie: ',
            'total'               => 'Gesamtpreisgarantie: ',
            'limitedEnergyPrice'  => 'Eingeschr. Preisgarantie: ',
            default               => '',
        };

        $p->Cell(40,5,$gLbl,0,0,'L');
        $p->Cell(15,5,($s['optGuarantee'] ?? 0).' Monate',0,0,'L');
        $p->Ln(8);

        /* Vertragslaufzeit */
        $p->SetX(-95);
        $p->Cell(40,5,'Vertragslaufzeit:',0,0,'L');
        $p->Cell(15,5,($s['optTerm'] ?? 0).' Monate',0,0,'L');
        $p->Ln(8);

        $p->SetY(236); 
        $p->SetX(-95);
        $p->SetFont('Arial','B',11);
        $p->Cell(69,5,'Jahresersparnis ca.',0,0,'C');
        $p->Ln(8);
        
        if($s['totalPriceCurrentProvider'] && $s['totalPriceWithoutBonus']){
            $ersparnis = number_format($s['totalPriceCurrentProvider']-$s['totalPriceWithoutBonus'],2,'.','');
            $p->SetX(-95);
            $p->SetFont('Arial','B',24);
            $p->Cell(69,8,$ersparnis.' '.$this->euro,0,0,'C');
            $p->Ln(8);
        }
       
    }

    private function drawTariffDisclaimer(): void
    {
        $p = $this->pdf;
        $raw = $this->tpl->getTariffDisclaimer();
        $clean = preg_replace('/\s+/',' ',trim($raw));
        // var_dump($clean);
        // exit;

        $p->SetY(261); $p->SetX(14);
        $p->SetFont('Arial','',8);
        $p->SetTextColor(0,0,0);
        $p->MultiCell(
            $p->GetPageWidth() - 14 - $p->getRightMargin(),
            3,
            iconv('UTF-8','CP1252//TRANSLIT',$clean),
            0,'L'
        );
    }
}