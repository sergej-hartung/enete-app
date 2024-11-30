<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User\User;
use Illuminate\Database\Eloquent\SoftDeletes;

class TariffTpl extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tariff_id',
        'matrix_id',
        'attribute_id',
        'auto_field_name',
        'auto_unit',
        'auto_value_source',
        'custom_field',
        'icon',
        'is_matrix',
        'is_html',
        'manual_field_name',
        'manual_unit',
        'manual_value',
        'manual_value_html',
        'position',
        'show_field_name',
        'show_icon',
        'show_unit',
        'show_value',
        'created_by',
        'updated_by'
    ];

    public function tariff()
    {
        return $this->belongsTo(Tariff::class, 'tariff_id');
    }

    public function matrix()
    {
        return $this->belongsTo(TariffCalcMatrix::class, 'matrix_id');
    }

    public function attribute()
    {
        return $this->belongsTo(TariffAttribute::class, 'attribute_id');
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
