<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TariffAttributeGroup extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'tariff_attribute_groups';
    protected $guarded = false;

    public function tariff()
    {
        return $this->belongsTo(Tariff::class, 'tariff_id');
    }

    public function attributes()
    {
        return $this->hasMany(TariffAttribute::class, 'attribute_group_id');
    }

    public function tariffAttributes()
    {
        return $this->belongsToMany(TariffAttribute::class, 'tariff_attribute_group_tariff', 'attribute_group_id', 'attribute_id')
                    ->withPivot('position'); // Получение позиции из промежуточной таблицы
                    //->withTimestamps();
    }
}
