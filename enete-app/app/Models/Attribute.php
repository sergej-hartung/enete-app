<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'name', 'input_type_id', 'unit', 'is_system', 'is_required', 'is_frontend_visible', 'tariff_id', 'details', 'created_by', 'updated_by'];

    public function inputType()
    {
        return $this->belongsTo(AttributeType::class, 'input_type_id');
    }

    public function tariff()
    {
        return $this->belongsTo(Tariff::class);
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
