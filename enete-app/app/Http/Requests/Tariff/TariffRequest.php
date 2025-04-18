<?php

namespace App\Http\Requests\Tariff;

use Illuminate\Foundation\Http\FormRequest;

class TariffRequest extends FormRequest
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
            'tariff.external_id'                           => 'nullable|sometimes|string|max:255',
            'tariff.file_id'                               => 'nullable|integer|exists:product_documents,id',
            'tariff.file_name'                             => 'nullable|string|max:255',
            'tariff.group_id'                              => 'integer|exists:tariff_groups,id',
            'tariff.id'                                    => 'nullable|integer',
            'tariff.is_published'                          => 'nullable|boolean',
            'tariff.name'                                  => 'nullable|string|max:255',
            'tariff.name_short'                            => 'nullable|string|max:255',
            'tariff.network_operator_id'                   => 'nullable|integer|exists:tariff_network_operators,id',
            'tariff.note'                                  => 'nullable|string',
            'tariff.provider_id'                           => 'nullable|integer|exists:tariff_providers,id',
            'tariff.status_id'                             => 'nullable|integer|exists:tariff_statuses,id',
            'tariff.period'                                => 'nullable|sometimes|string|max:255',
            'tariff.periodeTyp'                            => 'nullable|sometimes|string|max:255',

            'attribute_groups'                             => 'nullable|sometimes|array',
            'attribute_groups.*.id'                        => 'nullable|sometimes|integer|exists:tariff_attribute_groups,id',
            'attribute_groups.*.name'                      => 'nullable|sometimes|string|max:255',
            'attribute_groups.*.uniqueId'                  => 'nullable|sometimes|string|max:255',

            'attribute_groups.*.attributs'                 => 'nullable|sometimes|array',
            'attribute_groups.*.attributs.*.id'            => 'nullable|sometimes|integer|exists:tariff_attributes,id',
            'attribute_groups.*.attributs.*.code'          => 'nullable|sometimes|string|max:255',
            'attribute_groups.*.attributs.*.is_active'     => 'nullable|sometimes|boolean',
            'attribute_groups.*.attributs.*.name'          => 'nullable|sometimes|string|max:255',
            'attribute_groups.*.attributs.*.unit'          => 'nullable|sometimes|string|max:255',
            'attribute_groups.*.attributs.*.value_text'    => 'nullable|sometimes|string',
            'attribute_groups.*.attributs.*.value_varchar' => 'nullable|sometimes|string|max:255',


            'calc_matrix'                                  => 'nullable|sometimes|array',
            'calc_matrix.*.id'                             => 'nullable|sometimes|integer',
            'calc_matrix.*.name'                           => 'nullable|sometimes|string|max:255',
            'calc_matrix.*.total_value'                    => 'nullable|sometimes|numeric',
            'calc_matrix.*.uniqueId'                       => 'nullable|sometimes|string|max:255',
            'calc_matrix.*.hardware_charge'                => 'nullable|sometimes|boolean',
            'calc_matrix.*.unit'                           => 'nullable|sometimes|string|max:255',

            'calc_matrix.*.attributs'                      => 'nullable|sometimes|array',
            'calc_matrix.*.attributs.*.id'                 => 'nullable|sometimes|integer|exists:tariff_attributes,id',
            'calc_matrix.*.attributs.*.code'               => 'nullable|sometimes|string|max:255',
            'calc_matrix.*.attributs.*.name'               => 'nullable|sometimes|string|max:255',
            'calc_matrix.*.attributs.*.period'             => 'nullable|sometimes|string|max:255',
            'calc_matrix.*.attributs.*.periodeTyp'         => 'nullable|sometimes|string|max:255',
            'calc_matrix.*.attributs.*.single'             => 'nullable|sometimes|boolean',
            'calc_matrix.*.attributs.*.unit'               => 'nullable|sometimes|string|max:255',
            'calc_matrix.*.attributs.*.value'              => 'nullable|sometimes|string',
            'calc_matrix.*.attributs.*.value_total'        => 'nullable|sometimes|numeric',


            'categories'                                   => 'nullable|sometimes|array',
            'categories.*.id'                              => 'nullable|sometimes|integer|exists:tariff_categories,id',
            'categories.*.name'                            => 'nullable|sometimes|string|max:255',
            'categories.*.checked'                         => 'nullable|sometimes|boolean',


            'combo_status'                                 => 'nullable|sometimes|array',
            'combo_status.*.id'                            => 'nullable|sometimes|integer|exists:tariff_combo_statuses,id',
            'combo_status.*.name'                          => 'nullable|sometimes|string|max:255',
            'combo_status.*.checked'                       => 'nullable|sometimes|boolean',


            'promos'                                       => 'nullable|sometimes|array',
            'promos.*.id'                                  => 'nullable|sometimes|integer',
            'promos.*.end_date'                            => 'nullable|date',
            'promos.*.is_active'                           => 'nullable|sometimes|boolean',
            'promos.*.start_date'                          => 'nullable|date',
            'promos.*.text_long'                           => 'nullable|sometimes|string',
            'promos.*.title'                               => 'nullable|sometimes|string|max:255',


            'tariffdetails'                                => 'nullable|sometimes|array',
            'tariffdetails.*.id'                           => 'nullable|sometimes|integer',
            'tariffdetails.*.tariffAttributeGroupId'       => 'nullable|sometimes|integer',
            'tariffdetails.*.position'                     => 'nullable|sometimes|integer',
            'tariffdetails.*.name'                         => 'nullable|sometimes|string|max:255',
            'tariffdetails.*.uniqueId'                     => 'nullable|sometimes|string|max:255',

            'tariffdetails.*.attributs'                    => 'nullable|sometimes|array',
            'tariffdetails.*.attributs.*.id'               => 'nullable|sometimes|integer|exists:tariff_attributes,id',
            'tariffdetails.*.attributs.*.code'             => 'nullable|sometimes|string|max:255',
            'tariffdetails.*.attributs.*.is_active'        => 'nullable|sometimes|boolean',
            'tariffdetails.*.attributs.*.name'             => 'nullable|sometimes|string|max:255',
            'tariffdetails.*.attributs.*.unit'             => 'nullable|sometimes|string|max:255',
            'tariffdetails.*.attributs.*.value_text'       => 'nullable|sometimes|string',
            'tariffdetails.*.attributs.*.value_varchar'    => 'nullable|sometimes|string|max:255',


            'tpl'                                          => 'nullable|sometimes|array',
            'tpl.*.autoFieldName'                          => 'nullable|sometimes|boolean',
            'tpl.*.autoUnit'                               => 'nullable|sometimes|boolean',
            'tpl.*.autoValueSource'                        => 'nullable|sometimes|boolean',
            'tpl.*.customFild'                             => 'nullable|sometimes|boolean',
            'tpl.*.icon'                                   => 'nullable|sometimes|string|max:255',
            'tpl.*.id'                                     => 'nullable|sometimes|integer',
            'tpl.*.isMatrix'                               => 'nullable|sometimes|boolean',
            'tpl.*.isHtml'                                 => 'nullable|sometimes|boolean',
            'tpl.*.manualFieldName'                        => 'nullable|sometimes|string|max:255',
            'tpl.*.manualUnit'                             => 'nullable|sometimes|string|max:255',
            'tpl.*.manualValue'                            => 'nullable|sometimes|string|max:255',
            'tpl.*.manualValueHtml'                        => 'nullable|sometimes|string',
            'tpl.*.position'                               => 'nullable|sometimes|integer',
            'tpl.*.showFieldName'                          => 'nullable|sometimes|boolean',
            'tpl.*.showIcon'                               => 'nullable|sometimes|boolean',
            'tpl.*.showUnit'                               => 'nullable|sometimes|boolean',
            'tpl.*.showValue'                              => 'nullable|sometimes|boolean',

            'tpl.*.matrix.id'                              => 'nullable|sometimes|integer',
            'tpl.*.matrix.name'                            => 'nullable|sometimes|string|max:255',
            'tpl.*.matrix.total_value'                     => 'nullable|sometimes|numeric',
            'tpl.*.matrix.uniqueId'                        => 'nullable|sometimes|string|max:255',
            'tpl.*.matrix.hardware_charge'                => 'nullable|sometimes|boolean',
            'tpl.*.matrix.unit'                            => 'nullable|sometimes|string|max:255',

            'tpl.*.attribute.id'                           => 'nullable|sometimes|integer|exists:tariff_attributes,id',
            'tpl.*.attribute.code'                         => 'nullable|sometimes|string|max:255',
            'tpl.*.attribute.is_active'                    => 'nullable|sometimes|boolean',
            'tpl.*.attribute.name'                         => 'nullable|sometimes|string|max:255',
            'tpl.*.attribute.unit'                         => 'nullable|sometimes|string|max:255',
            'tpl.*.attribute.value_text'                   => 'nullable|sometimes|string',
            'tpl.*.attribute.value_varchar'                => 'nullable|sometimes|string|max:255',

            'sortings.*.id'                                 => 'nullable|sometimes|integer',
            'sortings.*.name'                               => 'nullable|sometimes|string|max:255',
            'sortings.*.description'                        => 'nullable|sometimes|string|max:255',
            'sortings.*.tariff_id'                          => 'nullable|sometimes|integer',
            'sortings.*.sorting_criteria_id'                => 'nullable|sometimes|integer',
            'sortings.*.value'                              => 'nullable|sometimes|numeric',
            'sortings.*.include_hardware'                   => 'nullable|sometimes|boolean',
            'sortings.*.matrix_uniqueId'                    => 'nullable|sometimes|string|max:255',
            'sortings.*.matrix_name'                        => 'nullable|sometimes|string|max:255',
            'sortings.*.attribute_id'                       => 'nullable|sometimes|integer|exists:tariff_attributes,id',
            'sortings.*.attribute_name'                     => 'nullable|sometimes|string|max:255',
            'sortings.*.unit'                               => 'nullable|sometimes|string|max:255',
        ];
    }
}