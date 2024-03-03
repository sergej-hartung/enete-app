<?php

namespace App\Http\Requests\User\Profile\Admin;

use Illuminate\Foundation\Http\FormRequest;

class IndexProfileRequest extends FormRequest
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
            'user_profile_categorie_id' => 'sometimes|string',
            'status_id' => 'sometimes|string',
            'search' => 'sometimes|string',
            'sortField' => 'sometimes|string',
            'sortOrder' => 'sometimes|string',
            'is_admin' => 'sometimes|boolean',
        ];
    }
}
