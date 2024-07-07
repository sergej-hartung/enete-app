<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TariffComboStatus extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'created_by', 'updated_by'];

    public function tariffs()
    {
        return $this->belongsToMany(Tariff::class, 'tariff_combo_status_mappings', 'combo_status_id', 'tariff_id');
    }
}
