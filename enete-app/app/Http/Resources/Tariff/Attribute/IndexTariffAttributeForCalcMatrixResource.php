<?php

namespace App\Http\Resources\Tariff\Attribute;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IndexTariffAttributeForCalcMatrixResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'period' => $this->pivot->period,
            'periodeTyp' => $this->pivot->periodeTyp,
            'single' => $this->pivot->single,
            'unit' => $this->pivot->unit,
            'value' => $this->pivot->value,
            'value_total' => $this->pivot->value_total,
        ];
    }
}
