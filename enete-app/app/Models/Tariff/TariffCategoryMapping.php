<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TariffCategoryMapping extends Model
{
    use HasFactory;

    protected $fillable = ['category_id', 'tariff_id', 'created_by', 'updated_by'];
}
