<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;



trait TariffProviderSortable {
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
            'id'                  => ['table' => 'tariff_providers', 'column' => 'id'],
            'name'                => ['table' => 'tariff_providers', 'column' => 'name'],
            'logo_id'             => ['table' => 'tariff_providers', 'column' => 'logo_id'],
            'is_filled_on_site'   => ['table' => 'tariff_providers', 'column' => 'is_filled_on_site'],
            'external_fill_link'  => ['table' => 'tariff_providers', 'column' => 'external_fill_link'],
            'created_at'          => ['table' => 'tariff_providers', 'column' => 'created_at'],
            'updated_at'          => ['table' => 'tariff_providers', 'column' => 'updated_at'],
            // Добавьте другие поля сортировки по мере необходимости
        ];

        if (isset($sortableFields[$sortField])) {
            $sortInfo = $sortableFields[$sortField];
            
            // Если поле для сортировки находится в основной таблице
            if ($sortInfo['table'] === 'tariff_providers') {
                $query = $query->orderBy($sortInfo['column'], $sortOrder);

            } 
        } else {
            // Если поле сортировки не указано, применяется сортировка по умолчанию
            $query = $query->orderBy('tariff_providers.' . $sortField, $sortOrder);
        }

        return $query;
    }

}