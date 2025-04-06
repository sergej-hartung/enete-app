<?php

namespace App\Http\Requests\Tariff\SortingCriteria;

use Illuminate\Foundation\Http\FormRequest;

class StoreSortingCriteriaRequest extends FormRequest
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
            'name'                    => 'nullable|sometimes|string|max:255',           
            'description'               => 'nullable|sometimes|string', 

            'tariff_groups'           => 'nullable|sometimes|array',
            'tariff_groups.*.id'      => 'nullable|sometimes|integer|exists:tariff_groups,id',
            'tariff_groups.*.checked' => 'nullable|sometimes|boolean',
            'tariff_groups.*.color'   => 'nullable|sometimes|string|max:255',
            'tariff_groups.*.icon'    => 'nullable|sometimes|string|max:255',
            'tariff_groups.*.name'    => 'nullable|sometimes|string|max:255',
    
        ];
    }
}