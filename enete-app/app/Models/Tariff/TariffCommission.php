<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TariffCommission extends Model
{
    use HasFactory;

    protected $fillable = [
        'tariff_id', 'status_id', 'commission_name', 'export_target_id', 'commission_fixed_eur_in',
        'commission_fixed_ontop', 'check_ontop', 'fixed_complete_commission_in', 'margin_fixed_eur',
        'commission_based_eur_in', 'commission_based_kwh_in', 'margin_based_eur', 'margin_based_kwh',
        'custom_commission_fixed_out', 'commission_fixed_out', 'consumption_of_kwh', 'consumption_up_to_kwh',
        'has_hardware', 'valid_from', 'valid_to', 'commission_type_id', 'interval_id', 'rounding_rules_id',
        'created_by', 'updated_by'
    ];

    public function tariff()
    {
        return $this->belongsTo(Tariff::class);
    }

    public function status()
    {
        return $this->belongsTo(TariffCommissionStatus::class, 'status_id');
    }

    public function commissionGroups()
    {
        return $this->belongsToMany(TariffCommissionGroup::class, 'commission_group_mappings', 'commission_id', 'group_id')->withPivot('difference');
    }
}
