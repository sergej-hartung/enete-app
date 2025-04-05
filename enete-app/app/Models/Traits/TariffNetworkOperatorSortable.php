<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;



trait TariffNetworkOperatorSortable  {
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
            'id'                  => ['table' => 'tariff_network_operators', 'column' => 'id'],
            'name'                => ['table' => 'tariff_network_operators', 'column' => 'name'],
            'logo_id'             => ['table' => 'tariff_network_operators', 'column' => 'logo_id'],
            'created_at'          => ['table' => 'tariff_network_operators', 'column' => 'created_at'],
            'updated_at'          => ['table' => 'tariff_network_operators', 'column' => 'updated_at'],
            // Добавьте другие поля сортировки по мере необходимости
        ];

        if (isset($sortableFields[$sortField])) {
            $sortInfo = $sortableFields[$sortField];
            
            // Если поле для сортировки находится в основной таблице
            if ($sortInfo['table'] === 'tariff_network_operators') {
                $query = $query->orderBy($sortInfo['column'], $sortOrder);

            } 
        } else {
            // Если поле сортировки не указано, применяется сортировка по умолчанию
            $query = $query->orderBy('tariff_network_operators.' . $sortField, $sortOrder);
        }

        return $query;
    }

}