<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;



/**
 * Apply dynamic sorting to the query.
 *
 * @param Builder $query
 * @param array $queryParams
 * @return Builder
 */
trait Sortable {
    public function scopeSort(Builder $query, array $data): Builder {
        $sortField = $data['sortField'] ?? 'id';
        $sortOrder = $data['sortOrder'] ?? 'asc';

        if ($sortField && in_array($sortOrder, ['asc', 'desc'])) {
            // Опционально, можно добавить проверку на допустимые поля для сортировки
            return $query->orderBy($sortField, $sortOrder);
        }

        return $query;
    }
}




