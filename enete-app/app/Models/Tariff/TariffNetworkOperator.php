<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProductDocuments;
use App\Models\Traits\Filterable;
use App\Models\Traits\TariffNetworkOperatorSortable;
use App\Models\User\User;

class TariffNetworkOperator extends Model
{
    use HasFactory;
    use Filterable;
    use TariffNetworkOperatorSortable;

    protected $fillable = ['name', 'logo_id', 'created_by', 'updated_by'];

    public function tariffs()
    {
        return $this->hasMany(Tariff::class, 'network_operator_id');
    }

    public function groups()
    {
        return $this->belongsToMany(TariffGroup::class,'tariff_group_network_operator_mappings','network_operator_id','group_id');
    }

    public function document()
    {
        return $this->belongsTo(ProductDocuments::class, 'logo_id');
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
            $this->groups()->exists();
    }
}
