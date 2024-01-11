<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TariffAttributeGroupTariff extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'tariff_attribute_group_tariff';
    protected $guarded = false;

    public function attributeGroup()
    {
        return $this->belongsTo(TariffAttributeGroup::class, 'attribute_group_id');
    }

    public function attribute()
    {
        return $this->belongsTo(TariffAttribute::class, 'attribute_id');
    }
}
