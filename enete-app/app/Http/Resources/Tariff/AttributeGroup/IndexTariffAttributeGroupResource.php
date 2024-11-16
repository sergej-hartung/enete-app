<?php

namespace App\Http\Resources\Tariff\AttributeGroup;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Tariff\Attribute\IndexTariffAttributeWithPivotResource;

class IndexTariffAttributeGroupResource extends JsonResource
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
            'name' => $this->name,
            'tariff_id' => $this->tariff_id,
            'attributs' => $this->whenLoaded('attributes')->map(function ($attribute) {
                return new IndexTariffAttributeWithPivotResource($attribute, $this->tariff_id);
            }),
                
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}