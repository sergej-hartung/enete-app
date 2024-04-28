<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TariffComboStatusMapping extends Model
{
    use HasFactory;
    
    protected $fillable = ['combo_status_id', 'tariff_id', 'created_by', 'updated_by'];
}
