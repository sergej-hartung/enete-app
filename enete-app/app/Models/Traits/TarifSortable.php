<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;
use App\Models\SortCategory;


trait TarifSortable {
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
        $hardwareId = $data['hardware_id'] ?? null; // ID оборудования, если передано
        //var_dump($data);
        // Массив, определяющий поля для сортировки и соответствующие таблицы и поля
        $sortableFields = [
            'id'             => ['table' => 'tariffs', 'column' => 'id'],
            'external_id'    => ['table' => 'tariffs', 'column' => 'external_id'],      
            'provider.name'  => ['table' => 'tariff_providers', 'column' => 'name'],
            'name_short'     => ['table' => 'tariffs', 'column' => 'name_short'],
            'status'         => ['table' => 'tariffs', 'column' => 'status_id'],
            'is_published'   => ['table' => 'tariffs', 'column' => 'is_published'],
            // Добавьте другие поля сортировки по мере необходимости
        ];

        // Проверяем, является ли поле названием категории сортировки
        $sortCategory = SortCategory::where('name', $sortField)->first();

        if ($sortCategory) {
            // Если категория найдена, применяем сортировку по её маппингу
            $query = $this->applySortCategory($query, $sortCategory, $sortOrder, $hardwareId);
            return $query;
        }

        // Стандартная обработка сортировки
        if (isset($sortableFields[$sortField])) {
            $sortInfo = $sortableFields[$sortField];
            
            // Если поле для сортировки находится в основной таблице
            if ($sortInfo['table'] === 'tariffs') {
                $query = $query->orderBy($sortInfo['column'], $sortOrder);
            } else {
                // Если поле для сортировки находится в связанной таблице
                $query = $query->leftJoin($sortInfo['table'], 'tariffs.provider_id', '=', $sortInfo['table'] . '.id')
                           ->orderBy($sortInfo['table'] . '.' . $sortInfo['column'], $sortOrder)
                           ->select('tariffs.*'); // Убедитесь, что выбираются поля только из основной таблицы
            }
        } else {
            // Если поле сортировки не указано, применяется сортировка по умолчанию
            $query = $query->orderBy('tariffs.' . $sortField, $sortOrder);
        }

        return $query;
    }


    /**
     * Применить сортировку по категории из sort_categories.
     *
     * @param Builder $query
     * @param SortCategory $sortCategory
     * @param string $sortOrder
     * @param int|null $hardwareId
     * @return Builder
     */
    protected function applySortCategory(Builder $query, SortCategory $sortCategory, string $sortOrder, ?int $hardwareId = null): Builder {
        $mappings = $sortCategory->mappings;
    
        $selectParts = [];
        $joins = [];
        $matrixCalculationAdded = false;
    
        foreach ($mappings as $mapping) {
            if ($mapping->source === 'matrix' && !$matrixCalculationAdded) {
                // Подключаем тарифные матрицы
                if (!in_array('tariff_calc_matrices', $joins)) {
                    $query->leftJoin('tariff_calc_matrices as tcm', 'tariffs.id', '=', 'tcm.tariff_id');
                    $joins[] = 'tariff_calc_matrices';
                }
    
                if ($hardwareId) {
                    $query->leftJoin('tariff_hardware_mappings as thm', function ($join) use ($hardwareId) {
                        $join->on('tcm.tariff_id', '=', 'thm.tariff_id')
                             ->where('thm.hardware_id', '=', $hardwareId);
                    });
                    $selectParts[] = 'tcm.total_value + IF(tcm.hardware_charge = 1, COALESCE(thm.price, 0), 0)';
                } else {
                    $selectParts[] = 'tcm.total_value';
                }
    
                $matrixCalculationAdded = true;
            } elseif ($mapping->source === 'attribute') {
                // Уникальные алиасы для каждого атрибута
                $attributeAlias = 'tam_' . $mapping->tariff_attribute_id;
                $attributeTableAlias = 'ta_' . $mapping->tariff_attribute_id;
    
                $query->leftJoin("tariff_attribute_mappings as $attributeAlias", function ($join) use ($mapping, $attributeAlias) {
                    $join->on('tariffs.id', '=', "$attributeAlias.tariff_id")
                         ->where("$attributeAlias.attribute_id", '=', $mapping->tariff_attribute_id)
                         ->where("$attributeAlias.is_active", '=', 1);
                })->leftJoin("tariff_attributes as $attributeTableAlias", "$attributeAlias.attribute_id", '=', "$attributeTableAlias.id");
    
                // Добавляем значение атрибута в расчёт
                $selectParts[] = "CAST(COALESCE($attributeAlias.value_varchar, 0) AS DECIMAL)";
            }
        }
    
        // Если есть расчетное поле, добавляем его и сортируем
        if (!empty($selectParts)) {
            $query->selectRaw('tariffs.*, (' . implode(' + ', $selectParts) . ') as calculated_value')
                  ->orderBy('calculated_value', $sortOrder);
        }
        dd($query->toSql(), $query->getBindings());
        return $query;
    }

}