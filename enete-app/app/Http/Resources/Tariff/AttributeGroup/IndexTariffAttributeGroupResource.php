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
            'attributs' => IndexTariffAttributeWithPivotResource::collection($this->attributes),
            //'attributs' => $this->attributes,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // 'id' => $this->id,
            // 'code' => $this->code,
            // 'name' => $this->name,
            // 'input_type_id' => $this->input_type_id,
            // 'input_type' => $this->inputType ? $this->inputType->name : null,
            // 'unit' => $this->unit,
            // 'is_system' => $this->is_system,
            // 'is_required' => $this->is_required,
            // 'is_frontend_visible' => $this->is_frontend_visible,
            // 'details' => $this->details,     
            // 'created_by' => $this->created_by,
            // 'updated_by' => $this->updated_by,
            // 'created_at' => $this->created_at,
            // 'updated_at' => $this->updated_at,
        ];
    }
}