<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\Filterable;
use App\Models\Traits\TarifSortable;
use App\Models\User\User;
use App\Models\ProductDocuments;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Tariff extends Model
{
    use HasFactory;
    use Filterable;
    use SoftDeletes;
    use TarifSortable;
    //use LogsActivity;

    protected $fillable = [
        'external_id', 
        'api_distributor_id', 
        'name', 
        'name_short', 
        'provider_id', 
        'network_operator_id', 
        'group_id', 
        'template_id', 
        'status_id', 
        'has_action', 
        'action_group_id', 
        'is_published', 
        'note', 
        'file_id', 
        'is_from_api', 
        'period',
        'periodeTyp',
        'created_by', 
        'updated_by'
    ];

    // Настройка атрибутов для логирования
    protected static $logAttributes = [
        'external_id', 
        'api_distributor_id', 
        'name', 
        'name_short', 
        'provider_id', 
        'network_operator_id', 
        'group_id', 
        'template_id', 
        'status_id', 
        'has_action', 
        'action_group_id', 
        'is_published', 
        'note', 
        'file_id', 
        'is_from_api'
    ];

    protected static $logOnlyDirty = true; // Логировать только изменения
    protected static $logName = 'tariff'; // Имя логов

    

    public function attributes()
    {
        return $this->belongsToMany(TariffAttribute::class, 'tariff_attribute_mappings', 'tariff_id', 'attribute_id')
                ->withPivot('value_varchar', 'value_text', 'is_active', 'created_by', 'updated_by')
                ->withTimestamps()
                ->using(TariffAttributeMapping::class);
    }

    public function promotions()
    {
        return $this->hasMany(TariffPromotion::class, 'tariff_id');
    }

    public function tariffDetails()
    {
        return $this->hasMany(TariffDetail::class, 'tariff_id')->orderBy('position');
    }

    public function tariffTpls()
    {
        return $this->hasMany(TariffTpl::class, 'tariff_id')->orderBy('position');
    }

    public function attributeGroups()
    {
        return $this->hasMany(TariffAttributeGroup::class);
    }

    public function hardware()
    {
        //return $this->belongsToMany(Hardware::class,'tariff_hardware_mappings','tariff_id','hardware_id')->withPivot('purchase_price');
    }

    public function comboStatus()
    {
        return $this->belongsToMany(TariffComboStatus::class, 'tariff_combo_status_mappings', 'tariff_id', 'combo_status_id');
    }

    public function category()
    {
        return $this->belongsToMany(TariffCategory::class, 'tariff_category_mappings', 'tariff_id', 'category_id');
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

    public function document()
    {
        return $this->belongsTo(ProductDocuments::class, 'file_id');
    }

    public function clacMatrices()
    {
        return $this->hasMany(TariffCalcMatrix::class, 'tariff_id');
    }

    public function sorting()
    {
        return $this->belongsToMany(TariffSortingCriteria::class, 'tariff_sorting_values', 'tariff_id', 'sorting_criteria_id')
                    ->withPivot('id','value', 'include_hardware', 'matrix_uniqueId', 'attribute_id') // Pivot-Felder
                    ->using(TariffSortingValue::class) // Pivot-Modell
                    ->withTimestamps();
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
