<?php

namespace App\Http\Resources\Tariff\Promo;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IndexTariffPromoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"         => $this->id,
            "tariff_id"  => $this->tariff_id,
            "start_date" => $this->start_date,
            "end_date"   => $this->end_date,
            "text_long"  => $this->text_long,
            "title"      => $this->title,
            "is_active"  => $this->is_active,           
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}