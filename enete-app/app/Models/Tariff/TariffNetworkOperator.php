<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User\User;

class TariffNetworkOperator extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'logo_id', 'created_by', 'updated_by'];

    public function groups()
    {
        return $this->belongsToMany(TariffGroup::class,'tariff_group_network_operator_mappings','network_operator_id','group_id');
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
