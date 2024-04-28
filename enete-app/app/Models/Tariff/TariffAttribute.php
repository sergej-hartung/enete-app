<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TariffAttribute extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'name', 'input_type_id', 'unit', 'is_system', 'is_required', 'is_frontend_visible', 'tariff_id', 'details', 'created_by', 'updated_by'];

    public function inputType()
    {
        return $this->belongsTo(AttributeType::class, 'input_type_id');
    }

    public function tariffs()
    {
        return $this->belongsToMany(Tariff::class, 'tariff_attribute_mappings')
                    ->withPivot('value_varchar', 'value_text', 'is_active')
                    ->withTimestamps();
    }

    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_attribute_mappings', 'attribute_id', 'group_id');
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