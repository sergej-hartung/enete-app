<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;



trait TariffAttributeSortable {
    /**
     * Apply dynamic sorting to the query.
     *
     * @param Builder $query
     * @param array $data
     * @return Builder
     */
    public function scopeSort(Builder $query, array $data): Builder {
        $sortField = $data['sortField'] ?? 'id';
        $sortOrder = $data['sortOrder'] ?? 'asc';

        // Массив, определяющий поля для сортировки и соответствующие таблицы и поля
        $sortableFields = [
            'id'                  => ['table' => 'tariff_attributes', 'column' => 'id'],
            'code'                => ['table' => 'tariff_attributes', 'column' => 'code'],
            'name'                => ['table' => 'tariff_attributes', 'column' => 'name'],
            'input_type'          => ['table' => 'tariff_attribute_types', 'column' => 'name'],
            'unit'                => ['table' => 'tariff_attributes', 'column' => 'unit'],
            'is_system'           => ['table' => 'tariff_attributes', 'column' => 'is_system'],
            'is_required'         => ['table' => 'tariff_attributes', 'column' => 'is_required'],
            'is_frontend_visible' => ['table' => 'tariff_attributes', 'column' => 'is_frontend_visible'],
            'created_at'          => ['table' => 'tariff_attributes', 'column' => 'created_at'],
            'updated_at'          => ['table' => 'tariff_attributes', 'column' => 'updated_at'],
            // Добавьте другие поля сортировки по мере необходимости
        ];

        if (isset($sortableFields[$sortField])) {
            $sortInfo = $sortableFields[$sortField];
            
            // Если поле для сортировки находится в основной таблице
            if ($sortInfo['table'] === 'tariff_attributes') {
                $query = $query->orderBy($sortInfo['column'], $sortOrder);

            } elseif ($sortInfo['table'] === 'tariff_attribute_types') {
                $query = $query->leftJoin('tariff_attribute_types', 'tariff_attributes.input_type_id', '=', 'tariff_attribute_types.id')
                               ->orderBy('tariff_attribute_types.' . $sortInfo['column'], $sortOrder)
                               ->select('tariff_attributes.*');
            }
        } else {
            // Если поле сортировки не указано, применяется сортировка по умолчанию
            $query = $query->orderBy('tariff_attributes.' . $sortField, $sortOrder);
        }

        return $query;
    }

}