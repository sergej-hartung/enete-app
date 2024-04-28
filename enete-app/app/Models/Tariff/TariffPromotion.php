<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TariffPromotion extends Model
{
    use HasFactory;

    protected $fillable = ['tariff_id', 'start_date', 'end_date', 'text_long', 'title', 'is_active', 'created_by', 'updated_by'];

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
