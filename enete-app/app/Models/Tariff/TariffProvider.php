<?php

namespace App\Models\Tariff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProductDocuments;
use App\Models\User\User;
use App\Models\Traits\Filterable;
use App\Models\Traits\TariffProviderSortable;

class TariffProvider extends Model
{
    use HasFactory;
    use Filterable;
    use TariffProviderSortable;

    protected $fillable = ['name', 'logo_id', 'is_filled_on_site', 'external_fill_link', 'created_by', 'updated_by'];

    public function tariffs()
    {
        return $this->hasMany(Tariff::class, 'provider_id');
    }

    public function groups()
    {
        return $this->belongsToMany(TariffGroup::class,'tariff_group_provider_mappings','provider_id','group_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function document()
    {
        return $this->belongsTo(ProductDocuments::class, 'logo_id');
    }

    public function isLinked(){

        return $this->tariffs()->exists() ||
            $this->groups()->exists();
    }
}
