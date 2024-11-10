<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

class TariffAttributeMapping extends Pivot
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'tariff_attribute_mappings';

    protected $fillable = [
        'tariff_id', 'attribute_id', 'value_varchar', 'value_text',
        'is_active', 'position', 'created_by', 'updated_by',
    ];

    protected $dates = ['created_at', 'updated_at', 'deleted_at'];
}