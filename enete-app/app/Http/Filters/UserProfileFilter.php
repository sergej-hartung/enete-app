<?php


namespace App\Http\Filters;

use App\Http\Filters\AbstractFilter;
use Illuminate\Database\Eloquent\Builder;

class UserProfileFilter extends AbstractFilter{
    public const SEARCH = 'search';
    public const STATUS = 'status_id';
    public const CATEGORIE = 'user_profile_categorie_id';

    protected function getCallbacks(): array
    {
        return [
            self::SEARCH => [$this, 'search'],
            self::STATUS => [$this, 'status'],
            self::CATEGORIE => [$this, 'categorie']
        ];
    }

    public function search(Builder $builder, $value){ 
        $builder->where(function ($query) use ($value) {
            $query->where('vp_nr', 'like', "%{$value}%")
                  ->orWhere('first_name', 'like', "%{$value}%")
                  ->orWhere('last_name', 'like', "%{$value}%");
        });
    }

    public function status(Builder $builder, $value){ 
        $builder->where('status_id', $value);
    }

    public function categorie(Builder $builder, $value){
        $builder->where('user_profile_categorie_id', $value);
     }
}
