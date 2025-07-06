<?php

namespace App\Services\Pdf\Base;

use Mpdf\Mpdf;
use App\Services\Pdf\OfferData;
use App\Services\Pdf\Templates\PdfOfferTemplate;

class MpdfEngine
{
    protected Mpdf $mpdf;
    protected PdfOfferTemplate $template;
    protected OfferData $data;

    public function __construct(PdfOfferTemplate $template, OfferData $data)
    {
        $this->template = $template;
        $this->data = $data;

        $config = [
            'mode' => 'utf-8',
            'format' => 'A4',
            'margin_left' => 17,
            'margin_right' => 18,
            'margin_top' => 7,
            'margin_bottom' => 15,
            'margin_header' => 0,
            'margin_footer' => 20,
            'fontDir' => [
                base_path('resources/fonts'),
            ],
            'fontdata' => [
                'raleway' => [
                    'R' => 'Raleway-Regular.ttf',
                    'B' => 'Raleway-Bold.ttf',
                    'I' => 'Raleway-Italic.ttf',
                ],
                'poppins' => [
                    'R' => 'Poppins-Regular.ttf',
                    'B' => 'Poppins-Bold.ttf',
                    'I' => 'Poppins-Italic.ttf',
                ],
                'roboto' => [
                    'R' => 'Roboto-Regular.ttf',
                    'B' => 'Roboto-Bold.ttf',
                    'I' => 'Roboto-Italic.ttf',
                ]
            ]
        ];

        $this->mpdf = new Mpdf($config);
    }

    public function addCover(): void
    {
        $this->mpdf->AddPage();
        $this->mpdf->SetFont('raleway', '', 24);
        $this->mpdf->WriteHTML('<h1>' . $this->template->getTitle() . '</h1>');

        $this->mpdf->SetFont('raleway', '', 12);
        $this->mpdf->WriteHTML('<p>' . nl2br(e($this->template->getOfferText(
            $this->data->client['salutation'] ?? '',
            $this->data->client['firstName'] ?? '',
            $this->data->client['lastName'] ?? ''
        ))) . '</p>');
    }

    public function addOffers(): void
    {
        $offers = $this->data->offers;

        foreach ($offers as $index => $offer) {
            $this->mpdf->AddPage();
            $this->mpdf->SetFont('poppins', '', 18);
            $this->mpdf->WriteHTML('<h2>Angebot ' . ($index + 1) . '</h2>');

            // Beispielhafter Block – hier kannst du Block1/2/3 einfügen
            $this->mpdf->SetFont('roboto', '', 12);
            $this->mpdf->WriteHTML('<p>Tarifname: ' . e($offer->tarif->data->attributes->name ?? '—') . '</p>');
        }
    }

    public function addSummary(): void
    {
        $this->mpdf->AddPage();
        $this->mpdf->SetFont('raleway', '', 20);
        $this->mpdf->WriteHTML('<h2>Zusammenfassung</h2>');

        $summaryText = $this->template->getTextLastSite();
        foreach ($summaryText as $line) {
            $this->mpdf->WriteHTML('<p>' . e($line) . '</p>');
        }
    }

    public function output(): string
    {
        return $this->mpdf->Output('', 'S'); // gibt als String zurück
    }
}