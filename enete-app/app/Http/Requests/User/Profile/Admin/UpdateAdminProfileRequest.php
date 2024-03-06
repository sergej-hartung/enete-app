<?php

namespace App\Http\Requests\User\Profile\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdminProfileRequest extends FormRequest
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
            
            'salutation'                                   => 'nullable|sometimes|string|max:255',
            'title'                                        => 'nullable|sometimes|string|max:255',
            'first_name'                                   => 'nullable|string|max:255',
            'last_name'                                    => 'nullable|string|max:255',
            'birthdate'                                    => 'nullable|sometimes|date',
            'email'                                        => 'sometimes|string|email|max:255',
            'email_sent'                                   => 'nullable|date',  
            'email_verification_hash'                      => 'nullable|string|max:255',
            'email_verified_at'                            => 'nullable|date',
            'internal_note'                                => 'nullable|string',
            'external_note'                                => 'nullable|string',

            'addresses'                                    => 'nullable|sometimes|array',
            'addresses.*.id'                               => 'nullable|sometimes|integer|exists:user_profile_addresses,id',
            'addresses.*.user_profile_address_category_id' => 'nullable|sometimes|integer|exists:user_profile_address_categories,id',
            'addresses.*.zip'                              => 'nullable|sometimes|string|max:10', 
            'addresses.*.city'                             => 'nullable|sometimes|string|max:255',
            'addresses.*.street'                           => 'nullable|sometimes|string|max:255',
            'addresses.*.house_number'                     => 'nullable|sometimes|string|max:255',
            'addresses.*.country'                          => 'nullable|sometimes|string|max:255', 

            // 'banks'                                        => 'nullable|sometimes|array',
            // 'banks.*.id'                                   => 'nullable|sometimes|integer|max:255|exists:user_profile_banks,id',
            // 'banks.*.salutation'                           => 'nullable|sometimes|string|max:255',
            // 'banks.*.first_name'                           => 'nullable|sometimes|string|max:255',
            // 'banks.*.last_name'                            => 'nullable|sometimes|string|max:255',
            // 'banks.*.zip'                                  => 'nullable|sometimes|string|max:10',
            // 'banks.*.city'                                 => 'nullable|sometimes|string|max:255',
            // 'banks.*.street'                               => 'nullable|sometimes|string|max:255',
            // 'banks.*.house_number'                         => 'nullable|sometimes|string|max:255',
            // 'banks.*.country'                              => 'nullable|sometimes|string|max:255',
            // 'banks.*.bic'                                  => 'nullable|sometimes|string|max:11', // BIC is typically 8 or 11 characters
            // 'banks.*.iban'                                 => 'nullable|sometimes|string|max:34', // IBAN max length is 34 characters
            // 'banks.*.bank_name'                            => 'nullable|sometimes|string|max:255',
            // 'banks.*.user_profile_bank_categorie_id'       => 'nullable|sometimes|integer|exists:user_profile_bank_categories,id',

            'contacts'                                     => 'nullable|sometimes|array',
            'contacts.*.id'                                => 'nullable|sometimes|integer|exists:user_profile_contacts,id',
            'contacts.*.user_profile_contact_category_id'  => 'nullable|sometimes|integer|exists:user_profile_contact_categories,id',
            'contacts.*.user_profile_contact_type_id'      => 'nullable|sometimes|integer|exists:user_profile_contact_types,id',
            'contacts.*.prefix'                            => 'nullable|sometimes|string|max:10',  // Customize based on expected prefix length
            'contacts.*.number'                            => 'nullable|sometimes|string|max:20',  // Adjust the max value based on the expected number length

            'users'                                        => 'nullable|array',
            'users.*.id'                                   => 'nullable|sometimes|integer|exists:users,id',
            'users.*.login_name'                           => 'sometimes|string|unique:users|max:255',
            'users.*.password'                             => 'sometimes|confirmed|min:6',
            'users.*.role_id'                              => 'sometimes|integer|exists:user_roles,id',
            'users.*.status_id'                            => 'sometimes|integer|exists:user_statuses,id',
            'avatar'                                       => 'sometimes|file',
            //'documents'            => 'array',

        ];
    }
}
