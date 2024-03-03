<?php

namespace App\Http\Requests\User\Profile\Employee;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeProfileRequest extends FormRequest
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
            'first_name'                                   => 'required|string|max:255',
            'last_name'                                    => 'required|string|max:255',           
            'birthdate'                                    => 'nullable|sometimes|date',
            'email'                                        => 'sometimes|string|email|max:255',
            'email_sent'                                   => 'nullable|date',  
            'email_verification_hash'                      => 'nullable|string|max:255',
            'email_verified_at'                            => 'nullable|date',
            'internal_note'                                => 'nullable|string',
            'external_note'                                => 'nullable|string',            
            'parent_id'                                    => 'nullable|integer|exists:user_profiles,id',

            'employee_details.vp_nr'                       => 'sometimes|string|unique:user_employee_details,vp_nr|max:255',
            'employee_details.egon_nr'                     => 'sometimes|string|unique:user_employee_details,egon_nr|max:255',
            'employee_details.company'                     => 'nullable|sometimes|string|max:255',
            'employee_details.marital_status'              => 'nullable|sometimes|string|max:255',
            'employee_details.id_card'                     => 'nullable|boolean',
            'employee_details.business_registration'       => 'nullable|boolean',
            'employee_details.sales_tax_liability'         => 'nullable|boolean',
            'employee_details.vat_liability_proven'        => 'nullable|boolean',
            'employee_details.tax_number'                  => 'nullable|string|max:255',
            'employee_details.tax_id'                      => 'nullable|string|max:255',
            'employee_details.tax_office'                  => 'nullable|string|max:255',
            'employee_details.datev_no'                    => 'nullable|string|max:255',
            'employee_details.entrance'                    => 'nullable|date',
            'employee_details.entry'                       => 'nullable|date',
            'employee_details.exit'                        => 'nullable|date',
            'employee_details.billing_blocked'             => 'nullable|boolean',
            'employee_details.payout_blocked'              => 'nullable|boolean',
            'employee_details.status_id'                   => 'nullable|integer|exists:user_employee_details_statuses,id',
            'employee_details.career_id'                   => 'nullable|integer|exists:user_employee_details_careers,id',                         //hinzufügen exist
            'employee_details.categorie_id'                 => 'nullable|integer|exists:user_employee_details_categories,id',

            'addresses'                                    => 'nullable|sometimes|array',
            'addresses.*.user_profile_address_category_id' => 'nullable|sometimes|integer|exists:user_profile_address_categories,id',
            'addresses.*.zip'                              => 'nullable|sometimes|string|max:10', 
            'addresses.*.city'                             => 'nullable|sometimes|string|max:255',
            'addresses.*.street'                           => 'nullable|sometimes|string|max:255',
            'addresses.*.house_number'                     => 'nullable|sometimes|string|max:255',
            'addresses.*.country'                          => 'nullable|sometimes|string|max:255', 

            'banks'                                        => 'nullable|sometimes|array',
            'banks.*.salutation'                           => 'nullable|sometimes|string|max:255',
            'banks.*.first_name'                           => 'nullable|sometimes|string|max:255',
            'banks.*.last_name'                            => 'nullable|sometimes|string|max:255',
            'banks.*.zip'                                  => 'nullable|sometimes|string|max:10',
            'banks.*.city'                                 => 'nullable|sometimes|string|max:255',
            'banks.*.street'                               => 'nullable|sometimes|string|max:255',
            'banks.*.house_number'                         => 'nullable|sometimes|string|max:255',
            'banks.*.country'                              => 'nullable|sometimes|string|max:255',
            'banks.*.bic'                                  => 'nullable|sometimes|string|max:11', // BIC is typically 8 or 11 characters
            'banks.*.iban'                                 => 'nullable|sometimes|string|max:34', // IBAN max length is 34 characters
            'banks.*.bank_name'                            => 'nullable|sometimes|string|max:255',
            'banks.*.user_profile_bank_categorie_id'        => 'nullable|sometimes|integer|exists:user_profile_bank_categories,id',

            'contacts'                                     => 'nullable|sometimes|array',
            'contacts.*.user_profile_contact_category_id'  => 'nullable|sometimes|integer|exists:user_profile_contact_categories,id',
            'contacts.*.user_profile_contact_type_id'      => 'nullable|sometimes|integer|exists:user_profile_contact_types,id',
            'contacts.*.prefix'                            => 'nullable|sometimes|string|max:10',  // Customize based on expected prefix length
            'contacts.*.number'                            => 'nullable|sometimes|string|max:20',  // Adjust the max value based on the expected number length

            'users'                                        => 'nullable|sometimes|array',
            'users.*.login_name'                           => 'required|string|unique:users|max:255',
            'users.*.password'                             => 'required|confirmed|min:6',
            'users.*.role_id'                              => 'required|integer|exists:user_roles,id',
            'users.*.status_id'                            => 'required|integer|exists:user_statuses,id',
            'avatar'                                       => 'file',

        ];
    }
}
