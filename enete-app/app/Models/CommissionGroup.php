<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommissionGroup extends Model
{
    use HasFactory;

    protected $fillable = ['group_name', 'icon', 'default_difference', 'created_by', 'updated_by'];

    public function mappings()
    {
        return $this->hasMany(CommissionGroupMapping::class, 'group_id');
    }
}
