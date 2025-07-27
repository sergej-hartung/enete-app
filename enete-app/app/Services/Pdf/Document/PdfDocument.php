<?php
// app/Services/Pdf/Document/PdfDocument.php
namespace App\Services\Pdf\Document;

use setasign\Fpdi\Fpdi;

/**
 * Eigene FPDI‑Ableitung:
 *  – Cell‑Padding setzen (setCellMargin)
 *  – Header / Footer wie im Alt‑Projekt
 */
class PdfDocument extends Fpdi
{
    /* -------------------------------------------------
       Öffentliche Helfer (Padding / Ränder)
    ------------------------------------------------- */
    public function setCellMargin(float $m): void   { $this->cMargin = $m; }
    public function getCellMargin(): float          { return $this->cMargin; }
    public function getLeftMargin(): float          { return $this->lMargin; }
    public function getRightMargin(): float         { return $this->rMargin; }
    public function getTopMargin(): float           { return $this->tMargin; }

    /* -------------------------------------------------
       Daten‑Container (CoverPage befüllt ihn!)
    ------------------------------------------------- */
    public array $params = [];

    private string $euro;

    public function __construct(...$args)
    {
        parent::__construct(...$args);
        $this->euro = iconv('UTF-8', 'CP1252', '€');
    }

    /* =================================================
       HEADER
    ================================================= */
    public function Header(): void
    {
        /* Logo – immer */
        if (isset($this->params['logo'])) {
            $this->Image($this->params['logo'], 144.3, 11, 49);
        }

        /* Seitenzahl ab Seite 2 */
        if ($this->PageNo() > 1) {
            $this->SetFont('Arial','',11);
            $this->Cell(0,12,'- '.$this->PageNo().' -',0,0,'C');
            return;                               // Header‑Inhalt nur auf Seite 1
        }

        /* ---------- Seite 1 / Deckblatt ---------- */
        $this->AddFont('Raleway','','Raleway-Regular.php');
        $this->AddFont('Raleway','B','Raleway-Bold.php');
        $this->SetFont('Raleway','',10);

        /* ‑‑ Ansprechpartner (rechts) ‑‑ */
        $s = $this->params['seller'] ?? [];
        $this->SetY(30);
        $this->SetX(-67);

        $this->Cell(71,3,'Ihr Ansprechpartner:',0,1,'L');
        $this->Ln(6);

        $this->SetFont('Raleway','',10);
        $this->SetTextColor(0,0,0);
        $this->SetX(-67);
        $this->Cell(71,4,iconv('UTF-8','CP1252//TRANSLIT',$s['company'] ?? ''));
        $this->Ln(5);

        $this->SetFont('Raleway','B',12);
        $this->SetTextColor(124,22,32);
        $this->SetX(-67);
        $name = trim(($s['salutation'] ?? '').' '.($s['firstName'] ?? '').' '.($s['lastName'] ?? ''));
        $this->Cell(71,4,iconv('UTF-8','CP1252//TRANSLIT',$name));
        $this->Ln(10);

        $this->SetFont('Raleway','',10);
        $this->SetTextColor(0,0,0);
        $this->SetX(-67);
        $this->Cell(71,4,
            iconv('UTF-8','CP1252//TRANSLIT',
                ($s['street'] ?? '').' '.($s['HouseNumber'] ?? '')
            )
        );
        $this->Ln();
        $this->SetX(-67);
        $this->Cell(71,4,
            iconv('UTF-8','CP1252//TRANSLIT',
                ($s['plz'] ?? '').' '.($s['city']['city'] ?? $s['city'] ?? '')
            )
        );
        $this->Ln(8);

        /* Telefon / … */
        $this->SetX(-67);
        if (!empty($s['phone'])) {
            $this->Cell(12,4,'Tel.');   $this->Cell(59,4,$s['phonePrefix'].'-'.$s['phone']);   $this->Ln(); $this->SetX(-67);
        }
        if (!empty($s['fax'])) {
            $this->Cell(12,4,'Fax');    $this->Cell(59,4,$s['faxPrefix']  .'-'.$s['fax']);     $this->Ln(); $this->SetX(-67);
        }
        if (!empty($s['mobile'])) {
            $this->Cell(12,4,'Mobil');  $this->Cell(59,4,$s['mobilePrefix'].'-'.$s['mobile']); $this->Ln(); $this->SetX(-67);
        }
        if (!empty($s['email'])) {
            $this->Cell(71,4,iconv('UTF-8','CP1252//TRANSLIT',$s['email']));
        }

        /* ‑‑ Kundenanschrift (links) ‑‑ */
        $c = $this->params['client']  ?? [];
        $co = $this->params['company'] ?? [];

        $this->SetFontSize(8);
        $this->SetY(52);

        $firmaZeile = sprintf('%s - %s %s - %s %s',
            $co['name'],$co['street'],$co['HouseNumber'],$co['zip'],$co['city']);
        $this->Cell(77,3,iconv('UTF-8','CP1252//TRANSLIT',$firmaZeile));
        $this->Ln(11);

        $this->SetFontSize(12);
        if (!empty($c['company'])) {
            $this->Cell(77,5,iconv('UTF-8','CP1252//TRANSLIT',$c['company']));
            $this->Ln();
        }

        $kunde = trim(($c['salutation'] ?? '').' '.($c['firstName'] ?? '').' '.($c['lastName'] ?? ''));
        $this->Cell(77,5,iconv('UTF-8','CP1252//TRANSLIT',$kunde));         $this->Ln();
        $this->Cell(77,5,
            iconv('UTF-8','CP1252//TRANSLIT',
                ($c['street'] ?? '').' '.($c['HouseNumber'] ?? '')
            )
        );                                                                    $this->Ln();
        $this->Cell(77,5,
            iconv('UTF-8','CP1252//TRANSLIT',
                ($c['plz'] ?? '').' '.($c['city'] ?? '')
            )
        );
        /* Freiraum vor Titel */
        $this->Ln(20);
    }

    /* =================================================
       FOOTER – nur auf Seite 1
    ================================================= */
    public function Footer(): void
    {
        if ($this->PageNo() !== 1) { return; }

        $co = $this->params['company'] ?? [];

        $this->SetFillColor(124,22,32);
        $this->SetY(-30);
        $this->Cell(0,1,'',0,1,'L',true);    // roter Strich
        $this->Ln(3);

        $this->AddFont('Raleway','','Raleway-Regular.php');
        $this->SetFont('Raleway','',8);

        /* Spalte 1 */
        $this->SetY(-26);
        foreach ([
            $co['name'],
            $co['street'].' '.$co['HouseNumber'],
            $co['zip'].' '.$co['city'],
            'Geschäftsführer: '.$co['manager'],
        ] as $row) {
            $this->SetX(17);
            $this->Cell(45,3.5,iconv('UTF-8','CP1252//TRANSLIT',$row)); $this->Ln();
        }

        /* Spalte 2 */
        $this->SetY(-26);
        foreach ([
            $co['bankName'],
            'IBAN: '.$co['iban'],
            'Ust.-Id.-Nr.: '.$co['ustIdNr'],
            $co['court'].' HRB: '.$co['hrb'],
        ] as $row) {
            $this->SetX(63);
            $this->Cell(84,3.5,iconv('UTF-8','CP1252//TRANSLIT',$row),0,0,'C'); $this->Ln();
        }

        /* Spalte 3 */
        $this->SetY(-26);
        foreach ([
            'Tel.: '.$co['phonePrefix'].'-'.$co['phone'],
            'Fax: '.$co['faxPrefix'].'-'.$co['fax'],
            'E-mail: '.$co['email'],
            'Internet: '.$co['homepage'],
        ] as $row) {
            $this->SetX(-62);
            $this->Cell(45,3.5,iconv('UTF-8','CP1252//TRANSLIT',$row),0,0,'R'); $this->Ln();
        }
    }
}