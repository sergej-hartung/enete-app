<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserProfileBank extends Model
{
    use HasFactory, SoftDeletes;
    protected $guarded = false;

    // Обратная связь с профилем пользователя
    public function userProfile()
    {
        return $this->belongsTo(UserProfile::class, 'user_profile_id');
    }

    // Связь с категорией банковского счета
    public function category()
    {
        return $this->belongsTo(UserProfileBankCategorie::class, 'user_profile_bank_categorie_id');
    }
}
