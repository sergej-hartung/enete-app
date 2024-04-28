<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TariffCommissionGroupMapping extends Model
{
    use HasFactory;

    protected $fillable = ['commission_id', 'group_id', 'difference', 'created_by', 'updated_by'];
}
