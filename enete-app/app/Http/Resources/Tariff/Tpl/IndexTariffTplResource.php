<?php

namespace App\Http\Resources\Tariff\Tpl;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Tariff\CalcMatrix\IndexCalcMatrixResource;
use App\Http\Resources\Tariff\Attribute\IndexTariffAttributeForTplResource;

class IndexTariffTplResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //var_dump('test');
        return [
            'id' => $this->id,
            'tariff_id' => $this->tariff_id,
            'auto_field_name' => $this->auto_field_name,
            'auto_unit' => $this->auto_unit,
            'auto_value_source' => $this->auto_value_source,
            'custom_field' => $this->custom_field,
            'icon' => $this->icon,
            'is_matrix' => $this->is_matrix,
            'manual_field_name' => $this->manual_field_name,
            'manual_unit' => $this->manual_unit,
            'manual_value' => $this->manual_value,
            'position' => $this->position,
            'show_field_name' => $this->show_field_name,
            'show_icon' => $this->show_icon,
            'show_unit' => $this->show_unit,
            'show_value' => $this->show_value,
            //'matrix' => new IndexCalcMatrixResource($this->whenLoaded('matrix')),
            'matrix' => $this->when($this->matrix_id !== null && $this->whenLoaded('matrix'), new IndexCalcMatrixResource($this->matrix)),
            'attribute' => $this->when(
                $this->attribute_id !== null && $this->whenLoaded('attribute'),
                function () {
                    // Передаем tariff_id напрямую в конструктор ресурса
                    return new IndexTariffAttributeForTplResource($this->attribute, $this->tariff_id);
                }
            ),
            //'attribute'
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}