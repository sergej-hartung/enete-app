<?php

namespace App\Http\Resources\Tariff\Detail;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Tariff\Attribute\IndexTariffAttributeForTplResource;

class TariffDetailWithAttributesResource extends JsonResource
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

        return [
            'id' => $this->id,
            'tariff_attributeg_groupId' => $this->attributeGroup->id, // Похоже, вам нужно, чтобы 'id' был null
            'name' => $this->attributeGroup->name,
            'uniqueId' => $this->attributeGroup->uniqueId, // Используйте соответствующий уникальный идентификатор или добавьте другой источник, если доступно
            'attributs' => $this->attributeGroup->attributes->map(function ($attribute) {
                
                $pivotData = $this->getTariffPivotDataForAttribute($attribute);

                return [
                    'code' => $attribute->code,
                    'id' => $attribute->id,
                    'is_active' => $pivotData['is_active'],
                    'name' => $attribute->name,
                    'unit' => $attribute->unit,
                    'value_varchar' => $pivotData['value_varchar'],
                    'value_text' => $pivotData['value_text'],
                ];
            }),
        ];
    }

    /**
     * Метод для получения данных из таблицы tariff_attribute_mappings для конкретного атрибута.
     *
     * @param $attribute
     * @return array
     */
    private function getTariffPivotDataForAttribute($attribute): array
    {
        if ($this->tariffId) {
            // Используем tariff_id для поиска соответствующего тарифа в атрибуте
            $tariff = $attribute->tariffs->firstWhere('id', $this->tariffId);

            if ($tariff && $tariff->pivot) {
                return [
                    'value_varchar' => $tariff->pivot->value_varchar ?? '',
                    'value_text' => $tariff->pivot->value_text ?? '',
                    'is_active' => $tariff->pivot->is_active ?? 0,
                ];
            }
        }

        // Если данные не найдены, возвращаем пустые значения
        return [
            'value_varchar' => '',
            'value_text' => '',
            'is_active' => 0,
        ];
    }
}