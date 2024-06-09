<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TariffAttributeGroup extends Model
{
    use HasFactory;

    protected $fillable = ['tariff_id', 'name', 'created_by', 'updated_by'];

    public function tariff()
    {
        return $this->belongsTo(Tariff::class);
    }

    public function attributes()
    {
        return $this->belongsToMany(TariffAttribute::class, 'tariff_attribute_group_mappings', 'attribute_group_id', 'attribute_id')
                    ->withPivot('value_varchar', 'value_text', 'is_active', 'position')
                    ->orderBy('position'); // Сортировка по position
    }
}
