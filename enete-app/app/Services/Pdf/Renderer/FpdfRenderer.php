<?php
namespace App\Services\Pdf\Renderer;

use Illuminate\Support\Facades\Storage;
use App\Services\Pdf\Contracts\PdfRendererInterface;
use App\Services\Pdf\Dto\OfferData;
use App\Services\Pdf\Builder\OfferPdfBuilder;

final class FpdfRenderer implements PdfRendererInterface
{
    public function render(OfferData $data): string
    {
        $builder = new OfferPdfBuilder();
        $pdf     = $builder->build($data);

        $fileName = 'offer_'.now()->format('Ymd_His').'.pdf';
        $path     = storage_path("app/pdfs/{$fileName}");
        $pdf->Output('F', $path);

        return $path;
    }
}