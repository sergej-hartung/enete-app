<?php

namespace App\Http\Requests\Tariff\Attribute;

use Illuminate\Foundation\Http\FormRequest;

class IndexTariffAttributeRequest extends FormRequest
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
            'tariff_group_id' => 'sometimes|string',
            'search' => 'sometimes|string',
            'sortField' => 'sometimes|string',
            'sortOrder' => 'sometimes|string',
            'hardware_id' => 'sometimes|string',
            'group_id' => 'sometimes|string'
        ];
    }
}