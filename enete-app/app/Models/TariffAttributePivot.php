<?php

namespace App\Models;


use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TariffAttributePivot extends Pivot
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'tariff_attribute'; // Имя таблицы
    protected $guarded = false;

    


    public function tariff()
    {
        return $this->belongsTo(Tariff::class, 'tariff_id');
    }

    public function attribute()
    {
        return $this->belongsTo(TariffAttribute::class, 'attribute_id');
    }
}
