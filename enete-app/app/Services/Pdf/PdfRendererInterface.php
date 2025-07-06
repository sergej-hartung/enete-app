<?php

namespace App\Services\Pdf;

interface PdfRendererInterface
{
    public function render(array $offerData): string;
}