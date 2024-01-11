<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TariffNetworkOperator extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'tariff_network_operators';
    protected $guarded = false;

    // Связь с тарифами
    public function tariffs()
    {
        return $this->hasMany(Tariff::class);
    }
}
