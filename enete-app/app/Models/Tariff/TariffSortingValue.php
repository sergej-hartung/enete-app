<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TariffSortingValue extends Pivot
{
    use HasFactory;

    protected $fillable = [
        'tariff_id',
        'sorting_criteria_id',
        'value',
        'include_hardware',
        'matrix_uniqueId',
        'attribute_id'
    ];

    public function tariff()
    {
        return $this->belongsTo(Tariff::class);
    }

    public function criteria()
    {
        return $this->belongsTo(TariffSortingCriteria::class, 'sorting_criteria_id');
    }
}
