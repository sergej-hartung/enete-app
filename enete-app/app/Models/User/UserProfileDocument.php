<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserProfileDocument extends Model
{
    use HasFactory, SoftDeletes;
    protected $guarded = false;

     // Связь адреса с профилем пользователя
     public function userProfile()
     {
         return $this->belongsTo(UserProfile::class, 'user_profile_id');
     }
}
