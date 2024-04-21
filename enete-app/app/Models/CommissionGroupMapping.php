<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommissionGroupMapping extends Model
{
    use HasFactory;

    protected $fillable = ['commission_id', 'group_id', 'difference', 'created_by', 'updated_by'];

    // public function commission() {
    //     return $this->belongsTo(Commission::class, 'commission_id');
    // }


    // public function group() {
    //     return $this->belongsTo(CommissionGroup::class, 'group_id');
    // }
}
