<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'icon', 'created_by', 'updated_by'];

    public function attributes()
    {
        return $this->belongsToMany(Attribute::class, 'group_attribute_mappings', 'group_id', 'attribute_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class,'group_category_mappings','group_id','category_id');
    }

    public function hardwareGroups()
    {
        return $this->belongsToMany(HardwareGroup::class, 'group_hardware_mappings','group_id','hardware_group_id');
    }

    public function networkOperators()
    {
        return $this->belongsToMany(NetworkOperator::class,'group_network_operator_mappings','group_id','network_operator_id');
    }

    public function providers()
    {
        return $this->belongsToMany(Provider::class,'group_provider_mappings','group_id','provider_id');
    }
}
