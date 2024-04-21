<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupAttributeMapping extends Model
{
    use HasFactory;

    protected $fillable = ['group_id', 'attribute_id', 'created_by', 'updated_by'];
}
