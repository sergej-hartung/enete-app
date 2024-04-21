<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryMapping extends Model
{
    use HasFactory;

    protected $fillable = ['category_id', 'tariff_id', 'created_by', 'updated_by'];

    // public function category()
    // {
    //     return $this->belongsTo(Category::class);
    // }

    // public function tariff()
    // {
    //     return $this->belongsTo(Tariff::class);
    // }
}
