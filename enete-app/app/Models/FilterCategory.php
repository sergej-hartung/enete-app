<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FilterCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'filter_type', 'description'];

    public function categoryMappings()
    {
        return $this->hasMany(CategoryMapping::class, 'category_id');
    }
}
