<?php

namespace App\Http\Resources\Tariff\Attribute;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IndexTariffAttributeForTplResource extends JsonResource
{
    protected $tariffId;

    public function __construct($resource, $tariffId = null)
    {
        parent::__construct($resource);
        $this->tariffId = $tariffId;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $tariffPivotData = $this->whenLoaded('tariffAttributes', function () {
            return $this->getTariffPivotData();
        }, []);

        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'unit' => $this->unit,
            'value_varchar' => $tariffPivotData['value_varchar'],
            'value_text' => $tariffPivotData['value_text'],
            'is_active' => $tariffPivotData['is_active'],
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
        if ($this->tariffId) {
            // Используем tariff_id для поиска соответствующего тарифа
            $tariff = $this->tariffAttributes->firstWhere('id', $this->tariffId);

            if ($tariff && $tariff->pivot) {
                return [
                    'value_varchar' => $tariff->pivot->value_varchar ?? null,
                    'value_text' => $tariff->pivot->value_text ?? null,
                    'is_active' => $tariff->pivot->is_active ?? null,
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