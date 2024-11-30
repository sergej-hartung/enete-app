<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TariffDetail extends Model
{
    use HasFactory;

    protected $fillable = ['tariff_id', 'tariff_attribute_group_id', 'position', 'created_by', 
        'updated_by'];

    public function tariff()
    {
        return $this->belongsTo(Tariff::class, 'tariff_id');
    }

    public function attributeGroup()
    {
        return $this->belongsTo(TariffAttributeGroup::class, 'tariff_attribute_group_id');
    }
}
