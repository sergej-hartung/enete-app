<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class TariffAttributeGroupMapping extends Model
{
    use HasFactory;

    protected $table = 'tariff_attribute_group_mappings';

    protected $fillable = [
        'attribute_group_id', 'attribute_id', 'position'
    ];

    public $timestamps = false;
}
