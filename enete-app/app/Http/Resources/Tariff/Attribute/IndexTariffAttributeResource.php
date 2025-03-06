<?php

namespace App\Http\Resources\Tariff\Attribute;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IndexTariffAttributeResource extends JsonResource
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
            'input_type_id' => $this->input_type_id,
            'input_type' => $this->whenLoaded('inputType', function () {
                return $this->inputType ? $this->inputType->name : null;
            }),
            'tariff_group_ids' => $this->whenLoaded('tariffGroups', function () {
                return $this->tariffGroups->pluck('id');
            }),
            'unit' => $this->unit,
            'is_system' => $this->is_system,
            'is_required' => $this->is_required,
            'is_frontend_visible' => $this->is_frontend_visible,
            'is_system_text' => $this->is_system ? 'Ja' : 'Nein',
            'is_required_text' => $this->is_required ? 'Ja' : 'Nein',
            'is_frontend_visible_text' => $this->is_frontend_visible ? 'Ja' : 'Nein',
            'details' => $this->details,   
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
