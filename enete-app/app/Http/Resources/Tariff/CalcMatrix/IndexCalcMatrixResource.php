<?php

namespace App\Http\Resources\Tariff\CalcMatrix;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Tariff\Attribute\IndexTariffAttributeForCalcMatrixResource;

class IndexCalcMatrixResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'uniqueId'    => $this->uniqueId,
            'tariff_id'   => $this->tariff_id,
            'name'        => $this->name,
            'total_value' => $this->total_value,
            'unit'        => $this->unit,
            //'position' => $this->position,
            'attributes'   => IndexTariffAttributeForCalcMatrixResource::collection($this->attributes),
            'created_by'  => $this->created_by,
            'updated_by'  => $this->updated_by,
            'created_at'  => $this->created_at,
            'updated_at'  => $this->updated_at,
        ];
    }
}