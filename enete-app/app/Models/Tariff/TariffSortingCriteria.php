<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\Filterable;
use App\Models\Traits\TariffSortingCriteriaSortable;

class TariffSortingCriteria extends Model
{
    use HasFactory;
    use Filterable;
    use TariffSortingCriteriaSortable;

    protected $fillable = [
        'group_id',
        'name',
        'description',
    ];

    public function groups()
    {
        return $this->belongsToMany(TariffGroup::class,'tariff_group_sorting_criterias_mapp','sorting_criterias_id','group_id');
    }

    public function sortingValues()
    {
        return $this->hasMany(TariffSortingValue::class, 'sorting_criteria_id');
    }

    public function isLinked()
    {
        return $this->groups()->exists();
    }
}
