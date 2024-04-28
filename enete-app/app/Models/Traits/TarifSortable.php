<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;



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

        // Массив, определяющий поля для сортировки и соответствующие таблицы и поля
        $sortableFields = [
            'id'             => ['table' => 'tariffs', 'column' => 'id'],
            'external_id'    => ['table' => 'tariffs', 'column' => 'external_id'],      
            'provider.name'  => ['table' => 'providers', 'column' => 'name'],
            'name_short'     => ['table' => 'tariffs', 'column' => 'name_short'],
            'status'         => ['table' => 'tariffs', 'column' => 'status_id'],
            'is_published'   => ['table' => 'tariffs', 'column' => 'is_published'],
            // Добавьте другие поля сортировки по мере необходимости
        ];

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

}