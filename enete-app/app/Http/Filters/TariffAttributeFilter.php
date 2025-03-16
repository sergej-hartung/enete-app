<?php


namespace App\Http\Filters;

use App\Http\Filters\AbstractFilter;
use Illuminate\Database\Eloquent\Builder;

class TariffAttributeFilter extends AbstractFilter{
    public const SEARCH = 'search';
    public const GROUP  = 'tariff_group_id';

    protected function getCallbacks(): array
    {
        return [
            self::SEARCH => [$this, 'search'],
            self::GROUP => [$this, 'group'],
        ];
    }

    public function search(Builder $builder, $value){ 
        $builder->where(function($query) use ($value) {
            $query->where('tariff_attributes.code', 'like', "%{$value}%")
                  ->orWhere('tariff_attributes.name', 'like', "%{$value}%")
                  ->orWhere('tariff_attributes.id', $value);
        });
    }


    public function group(Builder $builder, $value)
    { 
        if ($value !== 'all') {
            $builder->whereHas('tariffGroups', function (Builder $query) use ($value) {
                $query->where('tariff_group_attribute_mappings.group_id', $value);
            });
        }
    }
}