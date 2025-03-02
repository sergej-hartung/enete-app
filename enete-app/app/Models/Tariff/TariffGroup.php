<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class TariffGroup extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'icon', 'color', 'created_by', 'updated_by'];

    public function attributs()
    {
        return $this->belongsToMany(TariffAttribute::class, 'tariff_group_attribute_mappings', 'group_id', 'attribute_id');
    }

    public function categories()
    {
        return $this->belongsToMany(TariffCategory::class,'tariff_group_category_mappings','group_id','category_id');
    }

    // public function hardwareGroups()
    // {
    //     return $this->belongsToMany(HardwareGroup::class, 'group_hardware_mappings','group_id','hardware_group_id');
    // }

    public function networkOperators()
    {
        return $this->belongsToMany(TariffNetworkOperator::class,'tariff_group_network_operator_mappings','group_id','network_operator_id');
    }

    public function providers()
    {
        return $this->belongsToMany(TariffProvider::class,'tariff_group_provider_mappings','group_id','provider_id');
    }

    public function sorting()
    {
        return $this->hasMany(TariffSortingCriteria::class, 'group_id');
    }
}
