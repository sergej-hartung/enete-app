<?php


namespace App\Http\Filters;

use App\Http\Filters\AbstractFilter;
use Illuminate\Database\Eloquent\Builder;

class TariffFilter extends AbstractFilter{
    public const SEARCH = 'search';
    public const STATUS = 'status_id';
    public const PROVIDER = 'provider_id';
    public const NETWORKOPERATOR = 'network_operator_id';
    public const ISPUBLISHED = 'is_published';

    protected function getCallbacks(): array
    {
        return [
            self::SEARCH => [$this, 'search'],
            self::STATUS => [$this, 'status'],
            self::PROVIDER => [$this, 'provider'],
            self::NETWORKOPERATOR => [$this, 'networkoperator'],
            self::ISPUBLISHED => [$this, 'ispublished']
        ];
    }

    public function search(Builder $builder, $value){ 
        $builder->where(function($query) use ($value) {
            $query->where('tariffs.external_id', 'like', "%{$value}%")
                  ->orWhere('tariffs.name_short', 'like', "%{$value}%")
                  ->orWhere('tariffs.id', $value)
                  ->orWhereHas('provider', function ($subQuery) use ($value) {
                      $subQuery->where('name', 'like', "%{$value}%");
                  });
        });
    }

    // public function status(Builder $builder, $value){ 
    //     $builder->where('status_id', $value);
    // }

    public function status(Builder $builder, $value){ 
        // var_dump($value);
        if ($value !== 'all') {
            $builder->where('status_id', $value);
        }
        
    }

    public function provider(Builder $builder, $value){
        if ($value !== 'all') {
            $builder->where('provider_id', $value);
        }
    }

    public function networkoperator(Builder $builder, $value){
        if ($value !== 'all') {
            $builder->where('network_operator_id', $value);
        }
    }

    public function ispublished(Builder $builder, $value){ 
        if ($value !== 'all') {
            $builder->where('is_published', $value);
        }
    }
}