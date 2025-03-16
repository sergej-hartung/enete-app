<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User\User;
use App\Models\Traits\Filterable;
use App\Models\Traits\TariffAttributeSortable;

class TariffAttribute extends Model
{
    use HasFactory;
    use Filterable;
    use TariffAttributeSortable;

    protected $fillable = [
        'code', 
        'name', 
        'input_type_id', 
        'unit', 
        'is_system', 
        'is_required', 
        'is_frontend_visible', 
        'tariff_id', 
        'details', 
        'created_by', 
        'updated_by'
    ];

    protected $touches = ['tariffs'];

    public function inputType()
    {
        return $this->belongsTo(TariffAttributeType::class, 'input_type_id');
    }

    public function tariffs()
    {
        // return $this->belongsToMany(Tariff::class, 'tariff_attribute_mappings')
        //             ->withPivot('value_varchar', 'value_text', 'is_active')
        //             ->withTimestamps();
        return $this->belongsToMany(Tariff::class, 'tariff_attribute_mappings', 'attribute_id', 'tariff_id')
                ->withPivot('value_varchar', 'value_text', 'is_active', 'created_by', 'updated_by')
                ->withTimestamps()
                ->using(TariffAttributeMapping::class);
    }

    // public function attributeGroups()
    // {
    //     return $this->belongsToMany(TariffAttributeGroup::class, 'tariff_attribute_group_mappings', 'attribute_id', 'attribute_group_id')
    //                 ->withPivot('position')
    //                 ->orderBy('position'); // Сортировка по position
    // }

    public function groupAttributes()
    {
        return $this->belongsToMany(TariffAttributeGroup::class, 'tariff_attribute_group_mappings', 'attribute_id', 'attribute_group_id')
                    ->withPivot('position')
                    ->orderBy('position');
    }

    public function tariffAttributes()
    {
        return $this->belongsToMany(Tariff::class, 'tariff_attribute_mappings', 'attribute_id', 'tariff_id')
                    ->withPivot('value_varchar', 'value_text', 'is_active', 'created_by', 'updated_by')
                    ->withTimestamps()
                    ->using(TariffAttributeMapping::class);
    }

    public function tariffGroups()
    {
        return $this->belongsToMany(TariffGroup::class, 'tariff_group_attribute_mappings', 'attribute_id', 'group_id');
                    
    }

    public function tariffTpls()
    {
        return $this->hasMany(TariffTpl::class, 'attribute_id');
    }

    public function clacMatrices()
    {
        return $this->belongsToMany(TariffCalcMatrix::class, 'calc_matrix_attribute_mappings', 'attribute_id', 'calc_matrix_id')
            ->withPivot(['period', 'periodeTyp', 'single', 'unit', 'value', 'value_total'])
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

    public function isLinked(){

        return $this->tariffs()->exists() ||
            $this->groupAttributes()->exists() ||
            $this->tariffGroups()->exists() ||
            $this->tariffTpls()->exists() ||
            $this->clacMatrices()->exists();
    }

}
