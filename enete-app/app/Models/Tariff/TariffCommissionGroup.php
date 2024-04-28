<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TariffCommissionGroup extends Model
{
    use HasFactory;

    protected $fillable = ['group_name', 'icon', 'default_difference', 'created_by', 'updated_by'];

    public function commissions()
    {
        return $this->belongsToMany(Commission::class, 'commission_group_mappings', 'group_id', 'commission_id')->withPivot('difference');
    }
}
