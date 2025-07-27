<?php

namespace App\Services\Pdf\Dto;

/**
 * Reine Daten­träger‑Klasse. Kein Logik!
 */
class OfferData
{
    public function __construct(
        public array $client      = [],
        public array $seller      = [],
        public array $company     = [],
        public array $offers      = [],
        public array $ratesData   = [],
        public array $filterData  = [],
        public string $branch     = 'electric',   // electric | gas
    ) {}
}