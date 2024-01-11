<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TariffAttributeType extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'tariff_attribute_types';
    protected $guarded = false;

    public function attributes()
    {
        return $this->hasMany(TariffAttribute::class, 'attribute_type_id');
    }
}
