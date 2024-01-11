<?php

namespace App\Http\Requests\User\Profile;

use Illuminate\Foundation\Http\FormRequest;

class StoreProfileAddressRequest extends FormRequest
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
            'user_profile_address_category_id' => 'required|integer|exists:user_profile_address_categories,id',
            'zip' => 'required|string|max:10', // Adjust the max based on typical ZIP code lengths
            'city' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'house_number' => 'required|string|max:255',
            'country' => 'required|string|max:255' // You might want to validate against a list of countries
        ];
    }
}
