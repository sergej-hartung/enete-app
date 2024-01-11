<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tariff extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'tariffs';
    protected $guarded = false;


    public function attributes()
    {
        return $this->belongsToMany(TariffAttribute::class, 'tariff_attribute', 'tariff_id', 'attribute_id')
                    ->using(TariffAttributePivot::class)
                    ->withPivot('value_small', 'value_text', 'active', 'created_by', 'updated_by', 'created_at', 'updated_at', 'deleted_at');
    }

    public function attributeGroups()
    {
        return $this->hasMany(TariffAttributeGroup::class, 'tariff_id', 'id');
    }

    public function tariffAttributeGroupsWithAttributes()
    {
        return $this->hasMany(TariffAttributeGroup::class, 'tariff_id', 'id')
            ->with(['tariffAttributes' => function ($query) {
                $query->withPivot('position');
            }]);
    }

    public function distributor()
    {
        return $this->belongsTo(ApiDistributor::class, 'api_distributor_id');
    }

    public function type()
    {
        return $this->belongsTo(TariffType::class, 'tariff_type_id');
    }

    public function category()
    {
        return $this->belongsTo(TariffCategory::class, 'tariff_category_id');
    }

    public function provider()
    {
        return $this->belongsTo(TariffProvider::class, 'provider_id');
    }

    public function operator()
    {
        return $this->belongsTo(TariffNetworkOperator::class, 'network_operator_id');
    }

    public function group()
    {
        return $this->belongsTo(TariffGroup::class, 'tariff_group_id');
    }

    public function status()
    {
        return $this->belongsTo(TariffStatus::class, 'tariff_status_id');
    }
}
