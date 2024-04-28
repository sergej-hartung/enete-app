<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TariffGroupAttributeMapping extends Model
{
    use HasFactory;

    protected $fillable = ['group_id', 'attribute_id', 'created_by', 'updated_by'];
}
