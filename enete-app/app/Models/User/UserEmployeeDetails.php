<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserEmployeeDetails extends Model
{
    use HasFactory, SoftDeletes;


    public function status()
    {
        return $this->belongsTo(UserEmployeeDetailsStatus::class, 'status_id');
    }

    public function userProfile()
     {
        return $this->belongsTo(UserProfile::class, 'user_profile_id');
     }
}