<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TariffAttributeGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'tariff_id', 
        'name', 
        'created_by', 
        'updated_by'
    ];

    protected $touches = ['tariff'];

    public function tariff()
    {
        return $this->belongsTo(Tariff::class);
    }

    // public function attributs()
    // {
    //     return $this->belongsToMany(TariffAttribute::class, 'tariff_attribute_group_mappings', 'attribute_group_id', 'attribute_id')
    //                 ->withPivot('position')
    //                 ->orderBy('position'); // Сортировка по position

    // }

    public function attributes()
    {
        return $this->belongsToMany(TariffAttribute::class, 'tariff_attribute_group_mappings', 'attribute_group_id', 'attribute_id')
                    ->withPivot('position')
                    ->orderBy('position');
    }

    public function tariffDetails()
    {
        return $this->hasMany(TariffDetail::class, 'tariff_attribute_group_id')->orderBy('position');
    }
}
