<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TariffAttribute extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'tariff_attributes';
    protected $guarded = false;

    public function type()
    {
        return $this->belongsTo(TariffAttributeType::class, 'attribute_type_id');
    }

    public function tariffs()
    {
        return $this->belongsToMany(Tariff::class, 'tariff_attribute', 'attribute_id', 'tariff_id')
                    ->using(TariffAttributePivot::class)
                    ->withPivot('value_small', 'value_text', 'active', 'created_by', 'updated_by', 'created_at', 'updated_at', 'deleted_at');
    }

}
