<?php


namespace App\Http\Filters;

use App\Http\Filters\AbstractFilter;
use Illuminate\Database\Eloquent\Builder;

class UserProfileFilter extends AbstractFilter{
    public const SEARCH = 'search';
    public const STATUS = 'status_id';
    public const CATEGORIE = 'categorie_id';

    protected function getCallbacks(): array
    {
        return [
            self::SEARCH => [$this, 'search'],
            self::STATUS => [$this, 'status'],
            self::CATEGORIE => [$this, 'categorie']
        ];
    }

    // public function search(Builder $builder, $value){ 
    //     $builder->where(function ($query) use ($value) {
    //         $query->where('vp_nr', 'like', "%{$value}%")
    //               ->orWhere('first_name', 'like', "%{$value}%")
    //               ->orWhere('last_name', 'like', "%{$value}%");
    //     });
    // }

    public function search(Builder $builder, $value){ 
        $builder->whereHas('employee', function ($query) use ($value) {
            $query->where('vp_nr', 'like', "%{$value}%")
                  ->orWhere('first_name', 'like', "%{$value}%") // Если first_name и last_name находятся в user_profiles, их следует оставить вне whereHas
                  ->orWhere('last_name', 'like', "%{$value}%");
        });
    }

    // public function status(Builder $builder, $value){ 
    //     $builder->where('status_id', $value);
    // }

    public function status(Builder $builder, $value){ 
        $builder->whereHas('employee', function($query) use ($value) {
            $query->where('status_id', $value);
        });
    }

    public function categorie(Builder $builder, $value){
        // $builder->where('categorie_id', $value);
        $builder->whereHas('employee', function($query) use ($value) {
            $query->where('categorie_id', $value);
        });
     }
}
