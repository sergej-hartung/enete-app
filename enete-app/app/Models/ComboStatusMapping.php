<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComboStatusMapping extends Model
{
    use HasFactory;
    
    protected $fillable = ['combo_status_id', 'tariff_id', 'created_by', 'updated_by'];

    // public function comboStatus()
    // {
    //     return $this->belongsTo(ComboStatus::class);
    // }

    // public function tariff()
    // {
    //     return $this->belongsTo(Tariff::class);
    // }
}
