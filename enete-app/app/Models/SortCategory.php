<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SortCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];

    public function categoryMappings()
    {
        return $this->hasMany(CategoryMapping::class, 'category_id');
    }
}
