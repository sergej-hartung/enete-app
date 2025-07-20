<?php

namespace App\Services\Pdf\Base;

use setasign\Fpdi\Fpdi;

class OfferPdf extends Fpdi
{
    /* ------------------------------------------------------------------
       Layout-Konstanten
    ------------------------------------------------------------------ */
    public float $leftMargin  = 17;
    public float $rightMargin = 17;
    public float $topMargin   = 7;
    public float $rythm       = 4.7;      // Zeilen-Raster
    public float $currentY    = 0;

    /* Daten für Header / Footer / Blöcke */
    public array $params = [];
    private string $euro;

    /* ------------------------------------------------------------------
       Konstruktor
    ------------------------------------------------------------------ */
    public function __construct()
    {
        parent::__construct();
        $this->SetLeftMargin($this->leftMargin);
        $this->SetRightMargin($this->rightMargin);
        $this->SetTopMargin($this->topMargin);
        $this->euro = iconv('UTF-8', 'CP1252', '€');
    }

    /* ==================================================================
       HEADER  – 1-zu-1 aus dem Alt-Projekt
    ================================================================== */
    function Header()
    {
        /* Seitenzahl ab Seite 2 */
        $this->SetFont('Arial','',11);
        if ($this->PageNo() > 1) {
            $this->Cell(0,12,'- '.$this->PageNo().' -',0,0,'C');
        }

        /* Logo */
        $this->Image($this->params['logo'], 144.3, 11, 49);

        if ($this->PageNo() == 1) {

            $this->AddFont('Raleway','','Raleway-Regular.php');
            $this->AddFont('Raleway','B','Raleway-Bold.php');
            $this->SetFont('Raleway','',10);

            /* ========== Ansprechpartner rechts ========== */
            $this->SetY(30);
            $this->SetX(-67);
            $this->Cell(71,3,'Ihr Ansprechpartner:',0,0,'L');
            $this->Ln(9);

            /* Firma */
            $this->SetFontSize(10);
            $this->SetTextColor(0,0,0);
            $this->SetX(-67);
            $this->Cell(
                71,4,
                iconv('UTF-8','CP1252//TRANSLIT',$this->params['seller']['company'] ?? ''),
                0,0,'L'
            );
            $this->Ln(5);

            /* Name (rot) */
            $this->SetFontSize(12);
            $this->SetTextColor(124,22,32);
            $this->SetX(-67);
            $sellerName = trim(($this->params['seller']['salutation'] ?? '').' '.
                                ($this->params['seller']['firstName']  ?? '').' '.
                                ($this->params['seller']['lastName']   ?? ''));
            $this->Cell(71,4,iconv('UTF-8','CP1252//TRANSLIT',$sellerName),0,0,'L');
            $this->Ln(10);

            /* Straße */
            $this->SetFontSize(10);
            $this->SetTextColor(0,0,0);
            $this->SetX(-67);
            $this->Cell(
                71,4,
                iconv('UTF-8','CP1252//TRANSLIT',
                      ($this->params['seller']['street'] ?? '').' '.
                      ($this->params['seller']['HouseNumber'] ?? '')),
                0,0,'L'
            );
            $this->Ln();

            /* PLZ Ort */
            $this->SetX(-67);
            $this->Cell(
                71,4,
                iconv('UTF-8','CP1252//TRANSLIT',
                      ($this->params['seller']['plz'] ?? '').' '.
                      ($this->params['seller']['city']['city'] ?? '')),
                0,0,'L'
            );
            $this->Ln(8);

            /* Tel / Fax / Mobil */
            $this->SetX(-67);
            if (!empty($this->params['seller']['phone'])) {
                $this->Cell(12,4,'Tel.',0,0,'L');
                $this->Cell(
                    59,4,
                    $this->params['seller']['phonePrefix'].'-'.$this->params['seller']['phone'],
                    0,0,'L'
                );
                $this->Ln(); $this->SetX(-67);
            }
            if (!empty($this->params['seller']['fax'])) {
                $this->Cell(12,4,'Fax',0,0,'L');
                $this->Cell(
                    59,4,
                    $this->params['seller']['faxPrefix'].'-'.$this->params['seller']['fax'],
                    0,0,'L'
                );
                $this->Ln(); $this->SetX(-67);
            }
            if (!empty($this->params['seller']['mobile'])) {
                $this->Cell(12,4,'Mobil',0,0,'L');
                $this->Cell(
                    59,4,
                    $this->params['seller']['mobilePrefix'].'-'.$this->params['seller']['mobile'],
                    0,0,'L'
                );
                $this->Ln(); $this->SetX(-67);
            }
            /* Mail */
            $this->Cell(
                71,4,
                iconv('UTF-8','CP1252//TRANSLIT',$this->params['seller']['email'] ?? ''),
                0,0,'L'
            );

            /* ========== Kundenanschrift links ========== */
            $this->SetFontSize(8);
            $this->SetY(52);
            $company = sprintf('%s - %s %s - %s %s',
                $this->params['company']['name'],
                $this->params['company']['street'],
                $this->params['company']['HouseNumber'],
                $this->params['company']['zip'],
                $this->params['company']['city']
            );
            $this->Cell(77,3,iconv('UTF-8','CP1252//TRANSLIT',$company),0,0,'L');
            $this->Ln(11);

            $this->SetFontSize(12);
            $this->Cell(
                77,5,
                iconv('UTF-8','CP1252//TRANSLIT',$this->params['client']['company'] ?? ''),
                0,0,'L'); $this->Ln();

            $clientName = trim(($this->params['client']['salutation'] ?? '').' '.
                               ($this->params['client']['firstName']  ?? '').' '.
                               ($this->params['client']['lastName']   ?? ''));
            $this->Cell(77,5,iconv('UTF-8','CP1252//TRANSLIT',$clientName),0,0,'L');
            $this->Ln();

            $this->Cell(
                77,5,
                iconv('UTF-8','CP1252//TRANSLIT',
                      ($this->params['client']['street'] ?? '').' '.
                      ($this->params['client']['HouseNumber'] ?? '')),
                0,0,'L'); $this->Ln();

            $this->Cell(
                77,5,
                iconv('UTF-8','CP1252//TRANSLIT',
                      ($this->params['client']['plz'] ?? '').' '.
                      ($this->params['client']['city'] ?? '')),
                0,0,'L');

            /* Leerraum vor Titelblock */
            $this->Ln(20);
        }
    }

    /* ==================================================================
       FOOTER – nur auf Seite 1
    ================================================================== */
    function Footer()
    {
        if ($this->PageNo() != 1) {
            return;
        }

        /* roter Balken */
        $this->SetFillColor(124,22,32);
        $this->SetY(-30);
        $this->Cell(0,1,'',0,1,'L',true);
        $this->Ln(3);

        $this->AddFont('Raleway','','Raleway-Regular.php');
        $this->SetFont('Raleway','',8);

        /* Spalte 1 – Firma */
        $blocks1 = [
            $this->params['company']['name'],
            $this->params['company']['street'].' '.$this->params['company']['HouseNumber'],
            $this->params['company']['zip'].' '.$this->params['company']['city'],
            'Geschäftsführer: '.$this->params['company']['manager']
        ];
        $this->SetY(-26);
        foreach ($blocks1 as $row) {
            $this->SetX(17);
            $this->Cell(45,3.5,iconv('UTF-8','CP1252//TRANSLIT',$row),0,0,'L');
            $this->Ln();
        }

        /* Spalte 2 – Bank / Steuern / HRB */
        $blocks2 = [
            $this->params['company']['bankName'],
            'IBAN: '.$this->params['company']['iban'],
            'Ust.-Id.-Nr.: '.$this->params['company']['ustIdNr'],
            $this->params['company']['court'].' HRB: '.$this->params['company']['hrb']
        ];
        $this->SetY(-26);
        foreach ($blocks2 as $row) {
            $this->SetX(63);
            $this->Cell(84,3.5,iconv('UTF-8','CP1252//TRANSLIT',$row),0,0,'C');
            $this->Ln();
        }

        /* Spalte 3 – Kontakt */
        $blocks3 = [
            'Tel.: '.$this->params['company']['phonePrefix'].'-'.$this->params['company']['phone'],
            'Fax: '.$this->params['company']['faxPrefix'].'-'.$this->params['company']['fax'],
            'E-mail: '.$this->params['company']['email'],
            'Internet: '.$this->params['company']['homepage']
        ];
        $this->SetY(-26);
        foreach ($blocks3 as $row) {
            $this->SetX(-62);
            $this->Cell(45,3.5,iconv('UTF-8','CP1252//TRANSLIT',$row),0,0,'R');
            $this->Ln();
        }
    }

    /* ==================================================================
       PREISVERGLEICH-SEITE(N)
    ================================================================== */

    /** öffentliche Methode: fügt eine komplette Vergleichsseite ein */
    public function addPriceComparisonPage(
        int   $no,          // 1,2,3…
        array $offer,       // Ein Element aus $data['offers']
        array $ratesData,   // Aktueller Anbieter
        array $filterData   // z. B. filterBonus
    ): void
    {
        $this->AddPage();                       // Header läuft (Seitenzahl wird 2+)

        $providerNameHiden = isset($this->params['client']['providerNameHiden']) && $this->params['client']['providerNameHiden'] ? $this->params['client']['providerNameHiden'] : false;
 
        $this->drawOfferDataBlock($this->params['client'], $ratesData);

        $this->drawInformationBlock($offer, $ratesData, $filterData);

        /* Überschrift */
        $this->SetFont('Raleway','',17.5);
        $this->SetTextColor(125,22,33);
        $this->SetY(72);
        $this->Cell(0,10,"Preisvergleich {$no} |",0,0,'L');

        /* Daten vorbereiten */
        $cur = $this->prepareCurrentProvider($ratesData);
        $sw  = $this->prepareSwitchProvider($offer,$cur['totalPrice']);

        /* Rahmen + Blöcke zeichnen */
        $this->drawComparisonFrame();
        $this->drawCurrentProviderBlock($cur);
        $this->drawSwitchProviderBlock($sw,$filterData, $providerNameHiden);

        $this->drawTariffDisclaimer();
    }

    /* ------------------ Datenaufbereitung ------------------ */
    private function prepareCurrentProvider(array $r): array
    {
        /* totalPrice = Grundpreis + Arbeitspreis * Verbrauch */
        $work         = floatval($r['workPrice']     ?? 0);
        $workNt       = floatval($r['workPriceNt']   ?? 0);
        $baseYear     = floatval($r['basePriceYear'] ?? 0);
        $consum       = intval($r['consum']          ?? 0);
        $consumNt     = intval($r['consumNt']        ?? 0);
        $providerName = '';

        if(isset($r['providerName']['providerName'])){
            $providerName = $r['providerName']['providerName'];
        }else if(isset($r['providerName'] ) && is_string($r['providerName'])){
            $providerName = $r['providerName'];
        }

        $total = ($work * $consum)/100 + $baseYear;
        if ($workNt && $consumNt) {
            $total += ($workNt * $consumNt)/100;
        }
        return [
            'providerName' => $providerName,
            'basePriceYear'=> $baseYear,
            'workPrice'    => $work,
            'workPriceNt'  => $workNt,
            'totalPrice'   => round($total,2)
        ];
    }

    private function prepareSwitchProvider(array $o,float $totalCur): array
    {
        return [
            /* Werte direkt aus $offer oder berechnet */
            'providerName'       => $o['providerName'],
            'basePriceYear'      => floatval($o['basePriceYear']),
            'workPrice'          => floatval($o['workPrice']),
            'workPriceNt'        => floatval($o['workPriceNt']),
            'treueBonus'         => floatval($o['optBonus']),
            'wilkommensBonus'    => floatval($o['optBonusInstant']),
            'bleibeBonus'        => floatval($o['optBonusLoyalty']),
            'totalPrice'         => floatval($o['totalPrice']),
            'totalPriceWithoutBonus' => floatval($o['totalPriceWithoutBonus']),
            'partialPayment'     => intval($o['partialPayment']),
            'optGuarantee'       => intval($o['optGuarantee']),
            'optGuaranteeType'   => $o['optGuaranteeType'],
            'optTerm'            => intval($o['optTerm']),
            'totalPriceCurenProv'=> $totalCur
        ];
    }

    /* ------------------ Rahmen ------------------ */
    private function drawComparisonFrame(): void
    {
        /* linker grauer, rechter roter Kasten */
        $this->SetY(90);

        $this->SetFillColor(230,231,233);
        $this->Cell(85,167,'',0,0,'',true);

        $this->SetX(-103);
        $this->SetFillColor(157,27,39);
        $this->Cell(85,143,'',0,0,'',true);

        $this->SetY(232);
        $this->SetX(-103);
        $this->SetFillColor(125,22,33);
        $this->Cell(85,25,'',0,0,'',true);
    }

    /* ------------------ Block links ------------------ */
    private function drawCurrentProviderBlock(array $c): void
    {
        /* Überschrift */
        $this->SetY(96); $this->SetX(25);
        $this->SetFont('Raleway','',14);
        $this->SetTextColor(125,22,33);
        $this->Cell(69,5,'Ihr aktueller Anbieter:',0,0,'L');
        $this->Ln(12);

        /* Providername */
        if($c['providerName']){
            $this->SetFont('Raleway','B',17.5);
            $this->SetY(108);
            $this->SetX(25);
            $this->MultiCell(
                69,8,
                iconv('UTF-8','CP1252//TRANSLIT',$c['providerName'] ?: ' '),
                0,'L'
            );
            $this->Ln(8);
        }
        

        $this->SetFont('Arial','',10);
        $this->SetTextColor(0,0,0);

        /* Grundpreis Monat */
        if($c['basePriceYear']){
            $baseMonth = $c['basePriceYear'] ? number_format($c['basePriceYear']/12,2,'.','') : '0.00';
            $this->SetY(130);
            $this->SetX(25); 
            $this->Cell(40,5,'Grundpreis Monat:',0,0,'L');
            $this->SetFont('Arial','B',12);
            $this->Cell(15,5,$baseMonth.' '.$this->euro,0,0,'L'); $this->Ln(8);
        }
        

        /* Arbeitspreis */
        if ($c['workPrice']) {
            $this->SetFont('Arial','',10);
            $this->SetX(25); $this->Cell(40,5,'Arbeitspreis kWh:',0,0,'L');
            $this->SetFont('Arial','B',12);
            $this->Cell(15,5,number_format($c['workPrice'],2,'.','').' ct.',0,0,'L');
            $this->Ln(8);
        }
        if ($c['workPriceNt']) {
            //$this->SetFont('Arial','',10);
            $this->SetX(25); $this->Cell(40,5,'Arbeitspreis NT kWh:',0,0,'L');
            //$this->SetFont('Arial','B',12);
            $this->Cell(15,5,number_format($c['workPriceNt'],2,'.','').' ct.',0,0,'L');
            $this->Ln(8);
        }

        /* graue Linie */
         $this->currentY = $this->GetY();
        // $this->SetX(25);
        // $this->Cell(69,0.5,'',0,1,'L',true); 
        // $this->Ln(5);
        $this->SetFillColor(255,255,255);
        //$this->SetY($this->currentY + 2);
        $this->SetX(25);
        $this->Cell(69,0.5,"",0,1,'L',true);
        $this->Ln(5);

        /* Gesamtkosten */
        $this->SetX(25);
        $this->SetFont('Arial','B',11);
        $this->Cell(69,5,'Gesamtkosten pro Jahr:',0,0,'C');
        $this->Ln(8);

        if($c['totalPrice']){
            $this->SetX(25);
            $this->SetFont('Arial','B',24);
            $this->Cell(69,8,number_format($c['totalPrice'],2,'.','').' '.$this->euro,0,0,'C');
            $this->Ln(11);
        }
        

        // /* untere Linie */
        $this->SetY($this->currentY + 38);
        // $this->SetX(25);
        // $this->Cell(69,0.5,'',0,1,'L',true);
        // $this->Ln(5);

        //$this->SetY($this->currentY + 38);
        $this->SetFillColor(255,255,255);
        $this->SetX(25);
        $this->Cell(69,0.5,"",0,1,'L',true);
        $this->Ln(5);
    }

    /* ------------------ Block rechts ------------------ */
    private function drawSwitchProviderBlock(array $s,array $filterData, $providerNameHiden): void
    {
        $this->SetY(96); $this->SetX(-95);
        $this->SetFont('Raleway','',14);
        $this->SetTextColor(255,255,255);
        $this->Cell(69,5,'Unser Angebot:',0,0,'L');
        $this->Ln(12);

        if (!empty($s['providerName']) && !$providerNameHiden) {
            $this->SetFont('Raleway','B',17.5);
            $this->SetY(108);
            $this->SetX(-95);
            $this->MultiCell(
                69,8,
                iconv('UTF-8','CP1252//TRANSLIT',$s['providerName']),
                0,'L'
            );
            $this->Ln(8);
        }else{
            $this->SetFont('Raleway','B',17.5);
            $this->SetX(-95);
            $this->MultiCell(
                69,8,
                iconv('UTF-8','CP1252//TRANSLIT',''),
                0,'L'
            );
            $this->Ln(8);
        }

        $this->SetFont('Arial','',10);
        $this->SetTextColor(255,255,255);

        /* Grundpreis Monat */
        $baseMonth = number_format($s['basePriceYear']/12,2,'.','');
        $this->SetY(130);
        $this->SetX(-95); 
        $this->Cell(40,5,'Grundpreis Monat:',0,0,'L');
        $this->SetFont('Arial','B',12);
        $this->Cell(15,5,$baseMonth.' '.$this->euro,0,0,'L'); $this->Ln(8);

        /* Arbeitspreis */
        $this->SetFont('Arial','',10);
        $this->SetX(-95); $this->Cell(40,5,'Arbeitspreis kWh:',0,0,'L');
        $this->SetFont('Arial','B',12);
        $this->Cell(15,5,number_format($s['workPrice'],2,'.','').' ct.',0,0,'L');
        $this->Ln(8);

        if ($s['workPriceNt']>0) {
            $this->SetFont('Arial','',10);
            $this->SetX(-95); $this->Cell(40,5,'Arbeitspreis NT kWh:',0,0,'L');
            $this->SetFont('Arial','B',12);
            $this->Cell(15,5,number_format($s['workPriceNt'],2,'.','').' ct.',0,0,'L');
            $this->Ln(8);
        }

        /* Boni */
        foreach (['treueBonus'=>'Treue-Bonus:','wilkommensBonus'=>'Willkommensbonus:','bleibeBonus'=>'Bleibe-Bonus:'] as $k=>$label) {
            if ($s[$k]>0 && ($filterData['filterBonus'] ?? true)) {
                $this->SetFont('Arial','',10);
                $this->SetX(-95); $this->Cell(40,5,$label,0,0,'L');
                $this->SetFont('Arial','B',12);
                $this->Cell(15,5,number_format($s[$k],2,'.','').' '.$this->euro,0,0,'L');
                $this->Ln(8);
            }
        }

        $this->currentY = $this->GetY();
        /* obere Linie */
        $this->SetX(-95);
        $this->Cell(69,0.5,'',0,1,'L',true); $this->Ln(5);

        $this->SetX(-95);
        $this->SetFont('Arial','B',11);
        $this->Cell(69,5,'Gesamtkosten pro Jahr:',0,0,'C');
        $this->Ln(8);

        $this->SetX(-95);
        $this->SetFont('Arial','B',24);
        
        $this->Cell(69,8,number_format($s['totalPriceWithoutBonus'],2,'.','').' '.$this->euro,0,0,'C');
        $this->Ln(11);

        /* Monatsabschlag */
        if ($s['partialPayment']>0) {
            $this->SetX(-95);
            $this->SetFont('Arial','',13);
            $mon = number_format($s['totalPriceWithoutBonus']/$s['partialPayment'],2,'.','');
            $this->Cell(69,6,'ca. '.$mon.' '.$this->euro.' / mtl.',0,0,'C');
            $this->Ln(11);
        }

        /* untere Linie */
        $this->SetY($this->currentY + 38);
        $this->SetX(-95);
        $this->Cell(69,0.5,'',0,1,'L',true);
        $this->Ln(5);

        /* Garantie */
        $this->SetX(-95);
        $this->SetFont('Arial','I',10);
        $gLbl = ($s['optGuaranteeType']==='energyPrice') ? 'Energiepreisgarantie: '
              : (($s['optGuaranteeType']==='total') ? 'Gesamtpreisgarantie: ' : 'Preisgarantie: ');
        $this->Cell(40,5,$gLbl,0,0,'L');
        $this->Cell(15,5,$s['optGuarantee'].' Monate',0,0,'L'); $this->Ln(8);

        /* Vertragslaufzeit */
        $this->SetX(-95);
        $this->Cell(40,5,'Vertragslaufzeit: ',0,0,'L');
        $this->Cell(15,5,$s['optTerm'].' Monate',0,0,'L'); $this->Ln(8);

        /* Jahresersparnis */
        $this->SetY(236); 
        $this->SetX(-95);
        $this->SetFont('Arial','B',11);
        $this->Cell(69,5,'Jahresersparnis ca.',0,0,'C');
        $this->Ln(8);

        if($s['totalPriceCurenProv'] && $s['totalPrice']){
            $ersparnis = number_format($s['totalPriceCurenProv']-$s['totalPriceWithoutBonus'],2,'.','');
            $this->SetX(-95);
            $this->SetFont('Arial','B',24);
            $this->Cell(69,8,$ersparnis.' '.$this->euro,0,0,'C');
            $this->Ln(8);
        }
        
    }

    private function drawOfferDataBlock(array $client, array $rates): void
    {
        /* Überschrift */
        $this->AddFont('Raleway','','Raleway-Regular.php');
        $this->AddFont('Raleway','B','Raleway-Bold.php');
        $this->SetFont('Raleway','',17.5);
        $this->SetTextColor(125,22,33);

        $this->SetY(30);
        $this->Cell(0,13,'Ihre Angebotsdaten',0,0,'L');
        $this->Ln(14);

        /* Kunde */
        $this->SetFont('Raleway','',11.5);
        $this->SetTextColor(123,123,123);
        $this->Cell(30,5,'Kunde:',0,0,'L');

        $this->SetFont('Arial','B',11);
        $kunde = trim(
            ($client['salutation'] ?? '').' '.
            ($client['firstName']  ?? '').' '.
            ($client['lastName']   ?? '')
        );
        $this->MultiCell(0,5,iconv('UTF-8','CP1252//TRANSLIT',$kunde),0,'L');
        $this->Ln(1);

        /* Verbrauch HT */
        $this->SetFont('Raleway','',11.5);
        $this->SetTextColor(123,123,123);
        $this->Cell(30,10,'Verbrauch:',0,0,'L');

        $this->SetFont('Arial','B',11);
        $this->Cell(
            0,10,
            ($rates['consum'] ?? '').' kWh',
            0,0,'L'
        );
        $this->Ln(8);

        /* Optional: Verbrauch NT */
        if (!empty($rates['consumNt'])) {
            $this->SetFont('Raleway','',11.5);
            $this->SetTextColor(123,123,123);
            $this->Cell(30,10,'Verbrauch NT:',0,0,'L');

            $this->SetFont('Arial','B',11);
            $this->Cell(
                0,10,
                $rates['consumNt'].' kWh',
                0,0,'L'
            );
            $this->Ln(8);
        }
    }

    /* ---------------------------------------------------
   Infobox rechts:  Zur Information
    --------------------------------------------------- */
    private function drawInformationBlock(
        array $offer,       // derselbe Datensatz wie $s
        array $rates,       // $ratesData (braucht nur 'type')
        array $filterData   // filterBonus-Flag
    ): void
    {
        // Koordinaten: rechts neben Kundenblock
        $this->SetY(30);
        $this->SetX(-103);

        /* Rahmen-Kopf */
        $this->AddFont('Raleway','','Raleway-Regular.php');
        $this->SetFont('Raleway','',17.5);
        $this->SetTextColor(125,22,33);
        $this->cMargin = 3;
        $this->SetDrawColor(217,217,217);        // hellgraue Linie
        $this->Cell(85,13,'Zur Information','LTR',0,'L');
        $this->Ln(13);

        /* ---------------- Textzeilen ---------------- */
        $this->SetFont('Raleway','',10);

        // 1) Bonusabzug
        $bonusSum =
            floatval($offer['optBonus'] ?? 0) +
            floatval($offer['optBonusInstant'] ?? 0) +
            floatval($offer['optBonusLoyalty'] ?? 0);

        // if (($filterData['filterBonus'] ?? true) && $bonusSum > 0) {
        //     $this->SetTextColor(191,143,0);       // gold
        //     $this->SetX(-103);
        //     $this->MultiCell(
        //         85,7,
        //         iconv('UTF-8','CP1252//TRANSLIT',
        //             'Von den Gesamtkosten pro Jahr wurde der einmalige Bonus abgezogen.'),
        //         'LR','L'
        //     );
        //     $this->Ln(0);                         // 0 → keine zusätzliche Leerzeile
        // }

        // 2) Bruttopreis/Netto
        $this->SetTextColor(123,123,123);         // grau
        $this->SetX(-103);
        $suffix = ($rates['type'] ?? 'private') === 'company' ? 'netto.' : 'brutto.';
        $this->MultiCell(
            85,7,
            iconv('UTF-8','CP1252//TRANSLIT','Die angegebenen Preise sind '.$suffix),
            'LBR','L'
        );
    }

    private function drawTariffDisclaimer(): void
    {
       if ($this->PageNo() == 1) return;   // nur Vergleichsseiten


        $raw = $this->params['disclaimer'] ?? '';
        $clean = preg_replace('/\s+/', ' ', trim($raw));

        /* ---------- Positionieren ---------- */
        $this->SetY(261);                  // Höhe
        $this->SetX(14);

        $this->SetFont('Arial','',8);
        $this->SetTextColor(0,0,0);

        /* Breite = ganze Zeile */
        $width = $this->GetPageWidth() - 14 - $this->rMargin;

        $this->MultiCell(
            $width,                       
            3,                            
            iconv('UTF-8','CP1252',''.$clean),
            0,
            'L'
        );
    }


    /* ================================================================
   Schlussseite – "Wie geht es weiter?"
================================================================ */
public function addLastPage(): void
{
    $t  = $this->params['lastPage']['title']  ?? 'Wie geht es weiter?';
    $it = $this->params['lastPage']['items']  ?? [];
    $ck = $this->params['checkmark'];

    $this->AddPage();

    /* ── Kopf: roter Balken ───────────────────────────── */
    $this->SetFillColor(125,22,33);
    $this->SetY(47);
    $this->SetX($this->lMargin - 10);        // 7 mm Innenrand + 10 mm = 17 mm
    $this->Cell(155,24,'',0,0,'',true);

    /* Titel in Weiß */
    $this->SetY(55);
    $this->SetX(29);                         // leichte Einrückung
    $this->AddFont('Raleway','','Raleway-Regular.php');
    $this->SetFont('Raleway','',30);
    $this->SetTextColor(255,255,255);
    $this->Cell(0,5,iconv('UTF-8','CP1252//TRANSLIT',$t),0,0,'L');

    /* ── Check‑Liste links (items 0‑4) ─────────────────── */
    $this->SetY(104);
    $this->SetLeftMargin($this->lMargin);
    $this->AddFont('Raleway','','Raleway-Regular.php');
    $this->SetFont('Raleway','',14);
    $this->SetTextColor(0,0,0);

    foreach (array_slice($it,0,5) as $txt) {
        $y = $this->GetY();
        $this->Image($ck, 18, $y+1, 3);      // kleines Häkchen
        $this->SetX(18+7);
        $this->MultiCell(
            72,7,
            iconv('UTF-8','CP1252//TRANSLIT',$txt),
            0,'L'
        );
        $this->Ln(8);
    }

    /* ── Check‑Liste rechts (items 5‑n) ────────────────── */
    $this->SetY(104);
    foreach (array_slice($it,5) as $txt) {
        $y = $this->GetY();
        $this->Image($ck, 113, $y+1, 3);     // rechte Spalte
        $this->SetXY(120, $y);
        $this->MultiCell(
            72,7,
            iconv('UTF-8','CP1252//TRANSLIT',$txt),
            0,'L'
        );
        $this->Ln(8);
    }

    /* Linke Margin zurück­setzen */
    $this->SetLeftMargin($this->lMargin);
}
}