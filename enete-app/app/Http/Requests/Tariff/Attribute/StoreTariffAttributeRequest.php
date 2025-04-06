<?php

namespace App\Http\Requests\Tariff\Attribute;

use Illuminate\Foundation\Http\FormRequest;

class StoreTariffAttributeRequest extends FormRequest
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
            'code'                    => 'sometimes|string|max:255',
            
            'input_type_id'           => 'nullable|integer|exists:tariff_attribute_types,id',
            'is_frontend_visible'     => 'nullable|boolean',
            'is_required'             => 'nullable|boolean',
            'is_system'               => 'nullable|boolean',
            'name'                    => 'nullable|sometimes|string|max:255',
            'unit'                    => 'nullable|sometimes|string|max:255',

            'tariff_groups'           => 'nullable|sometimes|array',
            'tariff_groups.*.id'      => 'nullable|sometimes|integer|exists:tariff_groups,id',
            'tariff_groups.*.checked' => 'nullable|sometimes|boolean',
            'tariff_groups.*.color'   => 'nullable|sometimes|string|max:255',
            'tariff_groups.*.icon'    => 'nullable|sometimes|string|max:255',
            'tariff_groups.*.name'    => 'nullable|sometimes|string|max:255',

            'details'                 => 'nullable|sometimes|array',
            'details.*.name'          => 'nullable|sometimes|string|max:255',
    
        ];
    }
}