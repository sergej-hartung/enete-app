<?php

namespace App\Http\Requests\Tariff\OfferPdf;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OfferPdfRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;            // Auth‑Middleware ggf. separat regeln
    }

    public function rules(): array
    {
        return [
            'offerData'            => ['required', 'array'],
            'offerData.client'     => ['required', 'array'],
            'offerData.seller'     => ['required', 'array'],
            'offerData.offers'     => ['required', 'array', 'min:1'],
            'offerData.ratesData'  => ['required', 'array'],
            'offerData.branch'     => ['sometimes', Rule::in(['electric','gas'])],
            // … weitere Detail‑Validierung nach Bedarf
            'engine'               => ['sometimes', Rule::in(['fpdf','mpdf'])],
        ];
    }

    /**
     * Wenn ?engine=... gesetzt wird, schreiben wir sie
     * in die Request‑Daten, damit der Service‑Provider
     * darauf zugreifen kann.
     */
    protected function passedValidation(): void
    {
        if ($this->has('engine')) {
            session(['pdf_engine' => $this->input('engine')]);
        }
    }
}