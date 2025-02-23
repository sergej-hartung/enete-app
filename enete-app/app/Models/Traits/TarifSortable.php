<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;
use App\Models\SortCategory;
use App\Models\Tariff\TariffSortingCriteria;

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
        $groupId = $data['group_id'] ?? null; // ID группы тарифов
        //var_dump($data);
        // Массив, определяющий поля для сортировки и соответствующие таблицы и поля
        $sortableFields = [
            'id'             => ['table' => 'tariffs', 'column' => 'id'],
            'external_id'    => ['table' => 'tariffs', 'column' => 'external_id'],      
            'provider.name'  => ['table' => 'tariff_providers', 'column' => 'name'],
            'name_short'     => ['table' => 'tariffs', 'column' => 'name_short'],
            'created_at'     => ['table' => 'tariffs', 'column' => 'created_at'],
            'updated_at'     => ['table' => 'tariffs', 'column' => 'updated_at'],
            'status'         => ['table' => 'tariffs', 'column' => 'status_id'],
            'is_published'   => ['table' => 'tariffs', 'column' => 'is_published'],
            // Добавьте другие поля сортировки по мере необходимости
        ];

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
            if($groupId){
                $criteria = TariffSortingCriteria::where('group_id', $groupId)
                    ->where('name', $sortField)
                    ->first();

                if ($criteria) {
                    // Если категория найдена, применяем сортировку по её маппингу
                    
                    $query = $this->applyDynamicSorting($query, $criteria, $sortField, $sortOrder, $hardwareId);
                    return $query;
                }
            }
            
        }

        return $query;
    }


   
    /**
     * Apply dynamic sorting based on sorting criteria and hardware.
     *
     * @param Builder $query
     * @param int|null $groupId
     * @param string $sortField
     * @param string $sortOrder
     * @param int|null $hardwareId
     * @return Builder
     */
    protected function applyDynamicSorting(Builder $query, $criteria, string $sortField, string $sortOrder, ?int $hardwareId): Builder
    {
        
        // Подключаем таблицу с сортировочными значениями
        $query = $query
            ->leftJoin('tariff_sorting_values as tsv', 'tariffs.id', '=', 'tsv.tariff_id')
            ->where('tsv.sorting_criteria_id', $criteria->id);

        // Если включен флаг include_hardware в tariff_sorting_values
        $query = $query->leftJoin('tariff_hardware_mappings as thm', function ($join) use ($hardwareId) {
                $join->on('tariffs.id', '=', 'thm.tariff_id')
                     ->where('thm.hardware_id', '=', $hardwareId);
            })
            ->selectRaw('
                tariffs.*,
                tsv.value + 
                CASE WHEN tsv.include_hardware = TRUE THEN COALESCE(thm.total_value, 0) ELSE 0 END 
                AS total_value
            ')
            ->orderByRaw('total_value ' . $sortOrder);

            //dd($query->toSql(), $query->getBindings());
        return $query;
    }

}