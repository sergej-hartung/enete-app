<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TariffCalcMatrix extends Model
{
    use HasFactory;

    protected $fillable = [
        'tariff_id',
        'name',
        'total_value',
        'unit',
        'position',
    ];

    public function attributs()
    {
        return $this->belongsToMany(TariffAttribute::class, 'calc_matrix_attribute_mappings', 'calc_matrix_id', 'attribute_id')
            ->withPivot(['period', 'periodeTyp', 'single', 'unit', 'value', 'value_total'])
            ->orderBy('position');

    }
}
