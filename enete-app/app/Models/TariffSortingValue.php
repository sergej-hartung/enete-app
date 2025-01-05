<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TariffSortingValue extends Model
{
    use HasFactory;

    protected $fillable = [
        'tariff_id',
        'sorting_criteria_id',
        'value',
    ];

    public function tariff()
    {
        return $this->belongsTo(Tariff::class);
    }

    public function criteria()
    {
        return $this->belongsTo(GroupSortingCriteria::class, 'sorting_criteria_id');
    }
}
