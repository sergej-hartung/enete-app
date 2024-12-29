<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SortCategoryMapping extends Model
{
    use HasFactory;

    protected $fillable = ['sort_category_id', 'tariff_matrix_id', 'tariff_attribute_id', 'source', 'type'];

    public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'tariff_attribute_id');
    }

    public function matrix()
    {
        return $this->belongsTo(CalcMatrix::class, 'tariff_matrix_id');
    }

    public function category()
    {
        return $this->belongsTo(SortCategory::class, 'sort_category_id');
    }
}
