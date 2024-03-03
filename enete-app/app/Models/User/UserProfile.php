<?php

namespace App\Models\User;

use App\Models\Traits\Sortable;
use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserProfile extends Model
{
    use HasFactory, SoftDeletes, Filterable, Sortable;

    protected $guarded = false;

    public function users()
    {
        return $this->hasMany(User::class, 'user_profile_id');
    }

    // Связь пользователя с адресами
    public function addresses()
    {
        return $this->hasMany(UserProfileAddress::class, 'user_profile_id');
    }

    // Связь с пользовательским статусом
    // public function status()
    // {
    //     return $this->belongsTo(UserProfileStatus::class, 'status_id');
    // }

    public function employee()
    {
        return $this->hasOne(UserEmployeeDetails::class, 'user_profile_id');
    }

    // Связь с банковскими счетами
    public function banks()
    {
        return $this->hasMany(UserProfileBank::class, 'user_profile_id');
    }

    // Связь пользователя с контактами
    public function contacts()
    {
        return $this->hasMany(UserProfileContact::class, 'user_profile_id');
    }

    public function parent()
    {
        return $this->belongsTo(UserProfile::class, 'parent_id');
    }
}
