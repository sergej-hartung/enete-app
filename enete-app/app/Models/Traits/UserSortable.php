<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;



trait UserSortable {
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
            'id' => ['table' => 'user_profiles', 'column' => 'id'],
            'name' => ['table' => 'user_profiles', 'column' => 'name'],
            'vp_nr' => ['table' => 'user_employee_details', 'column' => 'vp_nr'],
            'status' => ['table' => 'user_employee_details', 'column' => 'status_id'],
            // Добавьте другие поля сортировки по мере необходимости
        ];

        if (isset($sortableFields[$sortField])) {
            $sortInfo = $sortableFields[$sortField];
            
            // Если поле для сортировки находится в основной таблице
            if ($sortInfo['table'] === 'user_profiles') {
                $query = $query->orderBy($sortInfo['column'], $sortOrder);
            } else {
                // Если поле для сортировки находится в связанной таблице
                $query = $query->leftJoin($sortInfo['table'], 'user_profiles.id', '=', $sortInfo['table'] . '.user_profile_id')
                               ->orderBy($sortInfo['table'] . '.' . $sortInfo['column'], $sortOrder)
                               ->select('user_profiles.*'); // Убедитесь, что выбираются поля только из основной таблицы
            }
        } else {
            // Если поле сортировки не указано, применяется сортировка по умолчанию
            $query = $query->orderBy('user_profiles.' . $sortField, $sortOrder);
        }

        return $query;
    }

}