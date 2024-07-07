<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User\User;

class TariffCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'is_filter_active', 'created_by', 'updated_by'];


    public function tariffs()
    {
        return $this->belongsToMany(Tariff::class, 'tariff_category_mappings', 'category_id', 'tariff_id');
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
