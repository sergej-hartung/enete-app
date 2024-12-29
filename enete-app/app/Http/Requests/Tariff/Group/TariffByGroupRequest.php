<?php

namespace App\Http\Requests\Tariff\Group;

use Illuminate\Foundation\Http\FormRequest;

class TariffByGroupRequest extends FormRequest
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
            'network_operator_id' => 'sometimes|string',
            'provider_id' => 'sometimes|string',
            'status_id' => 'sometimes|string',
            'is_published' => 'sometimes|string',
            'search' => 'sometimes|string',
            'sortField' => 'sometimes|string',
            'sortOrder' => 'sometimes|string',
            'hardware_id' => 'sometimes|string'
        ];
    }
}