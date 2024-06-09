<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\Filterable;
use App\Models\Traits\TarifSortable;
use App\Models\User\User;

class Tariff extends Model
{
    use HasFactory;
    use Filterable;
    use SoftDeletes;
    use TarifSortable;

    protected $fillable = ['external_id', 'api_distributor_id', 'name', 'name_short', 'provider_id', 'network_operator_id', 'group_id', 'template_id', 'status_id', 'has_action', 'action_group_id', 'is_web_active', 'note', 'pdf_document_id', 'is_from_api', 'created_by', 'updated_by'];

    // public function attributes()
    // {
    //     return $this->belongsToMany(Attribute::class, 'tariff_attribute_mappings')
    //                 ->withPivot('value_varchar', 'value_text', 'is_active')
    //                 ->withTimestamps();
    // }

    public function attributeGroups()
    {
        return $this->hasMany(TariffAttributeGroup::class);
    }

    public function hardware()
    {
        //return $this->belongsToMany(Hardware::class,'tariff_hardware_mappings','tariff_id','hardware_id')->withPivot('purchase_price');
    }

    public function provider()
    {
        return $this->belongsTo(TariffProvider::class);
    }

    public function networkOperator()
    {
        return $this->belongsTo(TariffNetworkOperator::class);
    }

    public function status()
    {
        return $this->belongsTo(TariffStatus::class);
    }

    public function group()
    {
        return $this->belongsTo(TariffGroup::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
