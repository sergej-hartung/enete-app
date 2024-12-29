<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SortCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];

    public function mappings()
    {
        return $this->hasMany(SortCategoryMapping::class, 'sort_category_id');
    }
}
