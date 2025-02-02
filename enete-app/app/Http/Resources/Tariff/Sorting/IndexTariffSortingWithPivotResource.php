<?php

namespace App\Http\Resources\Tariff\Sorting;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IndexTariffSortingWithPivotResource extends JsonResource
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
            'description' => $this->description,
            'criteria_id'    => $this->pivot->sorting_criteria_id,
            'value'          => $this->pivot->value,
            'include_hardware' => $this->pivot->include_hardware,
            'matrix_uniqueId' => $this->pivot->matrix_uniqueId,
            'attribute_id' => $this->pivot->attribute_id,
            
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}