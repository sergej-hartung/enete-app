<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApiDistributor extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'api_distributors';
    protected $guarded = false;

    // Связь с тарифами
    public function tariffs()
    {
        return $this->hasMany(Tariff::class);
    }
}
