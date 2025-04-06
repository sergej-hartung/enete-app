<?php

namespace App\Http\Requests\Tariff\Provider;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTariffProviderRequest extends FormRequest
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
            'logo_id'                 => 'nullable|integer|exists:product_documents,id',
            'file_name'               => 'nullable|sometimes|string|max:255', 
            'external_fill_link'      => 'nullable|sometimes|string|max:255', 
            'is_filled_on_site'       => 'nullable|boolean',

            'tariff_groups'           => 'nullable|sometimes|array',
            'tariff_groups.*.id'      => 'nullable|sometimes|integer|exists:tariff_groups,id',
            'tariff_groups.*.checked' => 'nullable|sometimes|boolean',
            'tariff_groups.*.color'   => 'nullable|sometimes|string|max:255',
            'tariff_groups.*.icon'    => 'nullable|sometimes|string|max:255',
            'tariff_groups.*.name'    => 'nullable|sometimes|string|max:255',
    
        ];
    }
}