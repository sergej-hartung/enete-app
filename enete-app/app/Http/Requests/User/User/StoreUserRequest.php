<?php

namespace App\Http\Requests\User\User;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_profile_id' => 'required|integer|exists:user_profiles,id',
            'login_name' => 'required|string|unique:users|max:255',
            'password' => 'required|confirmed|min:6',
            //'email' => 'required|string|email|max:255|unique:users',
            'role_id' => 'required|integer|exists:roles,id',
            'avatar' => 'string|nullable',
            //'email_sent' => 'boolean|nullable',
            //'email_verification_hash' => 'string|nullable',
        ];
    }
}
