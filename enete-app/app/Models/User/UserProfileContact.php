<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserProfileContact extends Model
{
    use HasFactory, SoftDeletes;
    protected $guarded = false;

    // Обратная связь с профилем пользователя
    public function userProfile()
    {
        return $this->belongsTo(UserProfile::class, 'user_profile_id');
    }

    // Связь контакта с категорией контакта
    public function contactCategory()
    {
        return $this->belongsTo(UserProfileContactCategorie::class, 'user_profile_contact_category_id');
    }

    // Связь контакта с типом контакта
    public function contactType()
    {
        return $this->belongsTo(UserProfileContactType::class, 'user_profile_contact_type_id');
    }
}
