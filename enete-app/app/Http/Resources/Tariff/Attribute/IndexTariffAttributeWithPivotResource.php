<?php

namespace App\Http\Resources\Tariff\Attribute;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IndexTariffAttributeWithPivotResource extends JsonResource
{
    protected $tariffId;

    public function __construct($resource, $tariffId = null)
    {
        parent::__construct($resource);
        $this->tariffId = $tariffId; // Сохраняем переданный tariffId для использования в других методах

    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $positionPivot = $this->pivot ? ['position' => $this->pivot->position] : [];
        // $tariffPivotData = $this->whenLoaded('tariffAttributes', function () {
        //     return $this->getTariffPivotData();
        // }, []);
        $tariffPivotData = $this->getTariffPivotData();

        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'input_type_id' => $this->input_type_id,
            'input_type' => $this->whenLoaded('inputType', function () {
                return $this->inputType ? $this->inputType->name : null;
            }),
            'unit' => $this->unit,
            'is_system' => $this->is_system,
            'is_required' => $this->is_required,
            'is_frontend_visible' => $this->is_frontend_visible,
            'details' => $this->details,   
            'pivot' => array_merge($positionPivot, $tariffPivotData),
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    /**
     * Метод для получения данных из таблицы tariff_attribute_mappings
     *
     * @return array
     */
    private function getTariffPivotData(): array
    {
        //var_dump($this->tariffId);
        if ($this->tariffId) {
            // Используем tariff_id для поиска соответствующего тарифа
            $tariff = $this->tariffAttributes->firstWhere('id', $this->tariffId);
            //var_dump($tariff);
            if ($tariff && $tariff->pivot) {
                return [
                    'value_varchar' => $tariff->pivot->value_varchar,
                    'value_text' => $tariff->pivot->value_text,
                    'is_active' => $tariff->pivot->is_active,
                ];
            }
        }

        // Если данные не найдены, возвращаем пустой массив
        return [
            'value_varchar' => null,
            'value_text' => null,
            'is_active' => null,
        ];
    }
}
