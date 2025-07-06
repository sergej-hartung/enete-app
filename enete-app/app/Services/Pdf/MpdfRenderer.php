<?php

namespace App\Services\Pdf;

use Mpdf\Mpdf;

class MpdfRenderer implements PdfRendererInterface
{
    public function render(array $offerData): string
    {
        $client = $offerData['client'] ?? [];
        $firstOffer = $offerData['offers'][0] ?? [];

        $mpdf = new Mpdf();

        $html = "
            <h2>Angebot für: {$client['firstName']} {$client['lastName']}</h2>
            <p>Adresse: {$client['street']} {$client['HouseNumber']}, {$client['plz']} {$client['city']}</p>
            <p>Anbieter: {$firstOffer['providerName']}</p>
            <p>Tarif: {$firstOffer['rateName']}</p>
            <p>Gesamtpreis: {$firstOffer['totalPrice']} €</p>
        ";

        $mpdf->WriteHTML($html);

        $outputPath = storage_path('app/pdfs/mpdf_test.pdf');
        $mpdf->Output($outputPath, \Mpdf\Output\Destination::FILE);

        return $outputPath;
    }
}