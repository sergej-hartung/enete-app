<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FilterSortMapping extends Model
{
    use HasFactory;

    protected $fillable = ['attribute_id', 'matrix_id', 'category_id', 'source', 'type'];

    public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'attribute_id');
    }

    public function matrix()
    {
        return $this->belongsTo(CalcMatrix::class, 'matrix_id');
    }

    public function category()
    {
        return $this->belongsTo(SortCategory::class, 'category_id')->orWhereBelongsTo(FilterCategory::class, 'category_id');
    }
}
