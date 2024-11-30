<?php

namespace App\Http\Requests\Tariff;

use Illuminate\Foundation\Http\FormRequest;

class TariffUpdateRequest extends FormRequest
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

            // updated
            'updated'                                               => 'nullable|array',
            'updated.*.tariff'                                      => 'nullable|sometimes|array',
            'updated.*.tariff.*.id'                                 => 'nullable|integer|exists:tariffs,id',
            'updated.*.tariff.*.external_id'                        => 'nullable|sometimes|string|max:255',
            'updated.*.tariff.*.name_short'                         => 'nullable|sometimes|string|max:255',
            'updated.*.tariff.*.name'                               => 'nullable|sometimes|string|max:255',
            'updated.*.tariff.*.provider_id'                        => 'nullable|sometimes|integer|exists:tariff_providers,id',
            'updated.*.tariff.*.network_operator_id'                => 'nullable|sometimes|integer|exists:tariff_network_operators,id',
            'updated.*.tariff.*.note'                               => 'nullable|sometimes|string',
            'updated.*.tariff.*.file_id'                            => 'nullable|sometimes|integer|exists:product_documents,id',
            'updated.*.tariff.*.file_name'                          => 'nullable|sometimes|string|max:255',
            'updated.*.tariff.*.group_id'                           => 'nullable|sometimes|integer|exists:tariff_groups,id',
            'updated.*.tariff.*.is_published'                       => 'nullable|sometimes|integer|boolean',
            'updated.*.tariff.*.status_id'                          => 'nullable|sometimes|integer|exists:tariff_statuses,id',

            


            'updated.*.attribute_groups'                             => 'nullable|sometimes|array',
            'updated.*.attribute_groups.*.id'                        => 'nullable|sometimes|integer|exists:tariff_attribute_groups,id',
            'updated.*.attribute_groups.*.name'                      => 'nullable|sometimes|string|max:255',
            'updated.*.attribute_groups.*.uniqueId'                  => 'nullable|sometimes|string|max:255',

            'updated.*.attribute_groups.*.attributs'                 => 'nullable|sometimes|array',
            'updated.*.attribute_groups.*.attributs.*.id'            => 'nullable|sometimes|integer|exists:tariff_attributes,id',
            'updated.*.attribute_groups.*.attributs.*.code'          => 'nullable|sometimes|string|max:255',
            'updated.*.attribute_groups.*.attributs.*.is_active'     => 'nullable|sometimes|boolean',
            'updated.*.attribute_groups.*.attributs.*.position'      => 'nullable|sometimes|integer',
            'updated.*.attribute_groups.*.attributs.*.name'          => 'nullable|sometimes|string|max:255',
            'updated.*.attribute_groups.*.attributs.*.unit'          => 'nullable|sometimes|string|max:255',
            'updated.*.attribute_groups.*.attributs.*.value_text'    => 'nullable|sometimes|string',
            'updated.*.attribute_groups.*.attributs.*.value_varchar' => 'nullable|sometimes|string|max:255',


            'updated.*.calc_matrix'                                  => 'nullable|sometimes|array',
            'updated.*.calc_matrix.*.id'                             => 'nullable|sometimes|integer',
            'updated.*.calc_matrix.*.name'                           => 'nullable|sometimes|string|max:255',
            'updated.*.calc_matrix.*.total_value'                    => 'nullable|sometimes|numeric',
            'updated.*.calc_matrix.*.uniqueId'                       => 'nullable|sometimes|string|max:255',
            'updated.*.calc_matrix.*.unit'                           => 'nullable|sometimes|string|max:255',

            'updated.*.calc_matrix.*.attributs'                      => 'nullable|sometimes|array',
            'updated.*.calc_matrix.*.attributs.*.id'                 => 'nullable|sometimes|integer|exists:tariff_attributes,id',
            'updated.*.calc_matrix.*.attributs.*.code'               => 'nullable|sometimes|string|max:255',
            'updated.*.calc_matrix.*.attributs.*.name'               => 'nullable|sometimes|string|max:255',
            'updated.*.calc_matrix.*.attributs.*.period'             => 'nullable|sometimes|string|max:255',
            'updated.*.calc_matrix.*.attributs.*.periodeTyp'         => 'nullable|sometimes|string|max:255',
            'updated.*.calc_matrix.*.attributs.*.position'           => 'nullable|sometimes|integer',
            'updated.*.calc_matrix.*.attributs.*.single'             => 'nullable|sometimes|boolean',
            'updated.*.calc_matrix.*.attributs.*.unit'               => 'nullable|sometimes|string|max:255',
            'updated.*.calc_matrix.*.attributs.*.value'              => 'nullable|sometimes|string',
            'updated.*.calc_matrix.*.attributs.*.value_total'        => 'nullable|sometimes|numeric',


            'updated.*.categories'                                   => 'nullable|sometimes|array',
            'updated.*.categories.*.id'                              => 'nullable|sometimes|integer|exists:tariff_categories,id',
            'updated.*.categories.*.name'                            => 'nullable|sometimes|string|max:255',
            'updated.*.categories.*.checked'                         => 'nullable|sometimes|boolean',


            'updated.*.combo_status'                                 => 'nullable|sometimes|array',
            'updated.*.combo_status.*.id'                            => 'nullable|sometimes|integer|exists:tariff_combo_statuses,id',
            'updated.*.combo_status.*.name'                          => 'nullable|sometimes|string|max:255',
            'updated.*.combo_status.*.checked'                       => 'nullable|sometimes|boolean',


            'updated.*.promos'                                       => 'nullable|sometimes|array',
            'updated.*.promos.*.id'                                  => 'nullable|sometimes|integer',
            'updated.*.promos.*.end_date'                            => 'nullable|sometimes|date',
            'updated.*.promos.*.is_active'                           => 'nullable|sometimes|boolean',
            'updated.*.promos.*.start_date'                          => 'nullable|sometimes|date',
            'updated.*.promos.*.text_long'                           => 'nullable|sometimes|string',
            'updated.*.promos.*.title'                               => 'nullable|sometimes|string|max:255',


            'updated.*.tariffdetails'                                => 'nullable|sometimes|array',
            'updated.*.tariffdetails.*.id'                           => 'nullable|sometimes|integer',
            'updated.*.tariffdetails.*.position'                     => 'nullable|sometimes|integer',
            'updated.*.tariffdetails.*.tariffAttributeGroupId'       => 'nullable|sometimes|integer',
            'updated.*.tariffdetails.*.name'                         => 'nullable|sometimes|string|max:255',
            'updated.*.tariffdetails.*.uniqueId'                     => 'nullable|sometimes|string|max:255',

            'updated.*.tariffdetails.*.attributs'                    => 'nullable|sometimes|array',
            'updated.*.tariffdetails.*.attributs.*.id'               => 'nullable|sometimes|integer|exists:tariff_attributes,id',
            'updated.*.tariffdetails.*.attributs.*.code'             => 'nullable|sometimes|string|max:255',
            'updated.*.tariffdetails.*.attributs.*.is_active'        => 'nullable|sometimes|boolean',
            'updated.*.tariffdetails.*.attributs.*.position'         => 'nullable|sometimes|integer',
            'updated.*.tariffdetails.*.attributs.*.name'             => 'nullable|sometimes|string|max:255',
            'updated.*.tariffdetails.*.attributs.*.unit'             => 'nullable|sometimes|string|max:255',
            'updated.*.tariffdetails.*.attributs.*.value_text'       => 'nullable|sometimes|string',
            'updated.*.tariffdetails.*.attributs.*.value_varchar'    => 'nullable|sometimes|string|max:255',


            'updated.*.tpl'                                          => 'nullable|sometimes|array',
            'updated.*.tpl.*.autoFieldName'                          => 'nullable|sometimes|boolean',
            'updated.*.tpl.*.autoUnit'                               => 'nullable|sometimes|boolean',
            'updated.*.tpl.*.autoValueSource'                        => 'nullable|sometimes|boolean',
            'updated.*.tpl.*.customFild'                             => 'nullable|sometimes|boolean',
            'updated.*.tpl.*.icon'                                   => 'nullable|sometimes|string|max:255',
            'updated.*.tpl.*.id'                                     => 'nullable|sometimes|integer',
            'updated.*.tpl.*.isMatrix'                               => 'nullable|sometimes|boolean',
            'updated.*.tpl.*.isHtml'                                 => 'nullable|sometimes|boolean',
            'updated.*.tpl.*.manualFieldName'                        => 'nullable|sometimes|string|max:255',
            'updated.*.tpl.*.manualUnit'                             => 'nullable|sometimes|string|max:255',
            'updated.*.tpl.*.manualValue'                            => 'nullable|sometimes|string|max:255',
            'updated.*.tpl.*.manualValueHtml'                        => 'nullable|sometimes|string',
            'updated.*.tpl.*.position'                               => 'nullable|sometimes|integer',
            'updated.*.tpl.*.showFieldName'                          => 'nullable|sometimes|boolean',
            'updated.*.tpl.*.showIcon'                               => 'nullable|sometimes|boolean',
            'updated.*.tpl.*.showUnit'                               => 'nullable|sometimes|boolean',
            'updated.*.tpl.*.showValue'                              => 'nullable|sometimes|boolean',

            'updated.*.tpl.*.matrix.*.id'                            => 'nullable|sometimes|integer',
            'updated.*.tpl.*.matrix.*.name'                          => 'nullable|sometimes|string|max:255',
            'updated.*.tpl.*.matrix.*.total_value'                   => 'nullable|sometimes|numeric',
            'updated.*.tpl.*.matrix.*.uniqueId'                      => 'nullable|sometimes|string|max:255',
            'updated.*.tpl.*.matrix.*.unit'                          => 'nullable|sometimes|string|max:255',

            'updated.*.tpl.*.attribute.*.id'                         => 'nullable|sometimes|integer|exists:tariff_attributes,id',
            'updated.*.tpl.*.attribute.*.code'                       => 'nullable|sometimes|string|max:255',
            'updated.*.tpl.*.attribute.*.is_active'                  => 'nullable|sometimes|boolean',
            'updated.*.tpl.*.attribute.*.position'                   => 'nullable|sometimes|integer',
            'updated.*.tpl.*.attribute.*.name'                       => 'nullable|sometimes|string|max:255',
            'updated.*.tpl.*.attribute.*.unit'                       => 'nullable|sometimes|string|max:255',
            'updated.*.tpl.*.attribute.*.value_text'                 => 'nullable|sometimes|string',
            'updated.*.tpl.*.attribute.*.value_varchar'              => 'nullable|sometimes|string|max:255',

            //added
            'added'                                      => 'nullable|array',
            'added.*.tariff'                             => 'nullable|sometimes|array',
            'added.*.tariff.*.id'                        => 'nullable|integer|exists:tariffs,id',
            'added.*.tariff.*.external_id'               => 'nullable|sometimes|string|max:255',
            'added.*.tariff.*.name_short'                => 'nullable|sometimes|string|max:255',
            'added.*.tariff.*.name'                      => 'nullable|sometimes|string|max:255',
            'added.*.tariff.*.provider_id'               => 'nullable|sometimes|integer|exists:tariff_providers,id',
            'added.*.tariff.*.network_operator_id'       => 'nullable|sometimes|integer|exists:tariff_network_operators,id',
            'added.*.tariff.*.note'                      => 'nullable|sometimes|string',
            'added.*.tariff.*.file_id'                   => 'nullable|sometimes|integer|exists:product_documents,id',
            'added.*.tariff.*.file_name'                 => 'nullable|sometimes|string|max:255',
            'added.*.tariff.*.group_id'                  => 'nullable|sometimes|integer|exists:tariff_groups,id',
            'added.*.tariff.*.is_published'              => 'nullable|sometimes|integer|boolean',
            'added.*.tariff.*.status_id'                 => 'nullable|sometimes|integer|exists:tariff_statuses,id',


            'added.*.attribute_groups'                             => 'nullable|sometimes|array',
            'added.*.attribute_groups.*.id'                        => 'nullable|sometimes|integer|exists:tariff_attribute_groups,id',
            'added.*.attribute_groups.*.name'                      => 'nullable|sometimes|string|max:255',
            'added.*.attribute_groups.*.uniqueId'                  => 'nullable|sometimes|string|max:255',

            'added.*.attribute_groups.*.attributs'                 => 'nullable|sometimes|array',
            'added.*.attribute_groups.*.attributs.*.id'            => 'nullable|sometimes|integer|exists:tariff_attributes,id',
            'added.*.attribute_groups.*.attributs.*.code'          => 'nullable|sometimes|string|max:255',
            'added.*.attribute_groups.*.attributs.*.is_active'     => 'nullable|sometimes|boolean',
            'added.*.attribute_groups.*.attributs.*.position'      => 'nullable|sometimes|integer',
            'added.*.attribute_groups.*.attributs.*.name'          => 'nullable|sometimes|string|max:255',
            'added.*.attribute_groups.*.attributs.*.unit'          => 'nullable|sometimes|string|max:255',
            'added.*.attribute_groups.*.attributs.*.value_text'    => 'nullable|sometimes|string',
            'added.*.attribute_groups.*.attributs.*.value_varchar' => 'nullable|sometimes|string|max:255',


            'added.*.calc_matrix'                                  => 'nullable|sometimes|array',
            'added.*.calc_matrix.*.id'                             => 'nullable|sometimes|integer',
            'added.*.calc_matrix.*.name'                           => 'nullable|sometimes|string|max:255',
            'added.*.calc_matrix.*.total_value'                    => 'nullable|sometimes|numeric',
            'added.*.calc_matrix.*.uniqueId'                       => 'nullable|sometimes|string|max:255',
            'added.*.calc_matrix.*.unit'                           => 'nullable|sometimes|string|max:255',

            'added.*.calc_matrix.*.attributs'                      => 'nullable|sometimes|array',
            'added.*.calc_matrix.*.attributs.*.id'                 => 'nullable|sometimes|integer|exists:tariff_attributes,id',
            'added.*.calc_matrix.*.attributs.*.code'               => 'nullable|sometimes|string|max:255',
            'added.*.calc_matrix.*.attributs.*.name'               => 'nullable|sometimes|string|max:255',
            'added.*.calc_matrix.*.attributs.*.period'             => 'nullable|sometimes|string|max:255',
            'added.*.calc_matrix.*.attributs.*.periodeTyp'         => 'nullable|sometimes|string|max:255',
            'added.*.calc_matrix.*.attributs.*.position'           => 'nullable|sometimes|integer',
            'added.*.calc_matrix.*.attributs.*.single'             => 'nullable|sometimes|boolean',
            'added.*.calc_matrix.*.attributs.*.unit'               => 'nullable|sometimes|string|max:255',
            'added.*.calc_matrix.*.attributs.*.value'              => 'nullable|sometimes|string',
            'added.*.calc_matrix.*.attributs.*.value_total'        => 'nullable|sometimes|numeric',


            'added.*.categories'                                   => 'nullable|sometimes|array',
            'added.*.categories.*.id'                              => 'nullable|sometimes|integer|exists:tariff_categories,id',
            'added.*.categories.*.name'                            => 'nullable|sometimes|string|max:255',
            'added.*.categories.*.checked'                         => 'nullable|sometimes|boolean',


            'added.*.combo_status'                                 => 'nullable|sometimes|array',
            'added.*.combo_status.*.id'                            => 'nullable|sometimes|integer|exists:tariff_combo_statuses,id',
            'added.*.combo_status.*.name'                          => 'nullable|sometimes|string|max:255',
            'added.*.combo_status.*.checked'                       => 'nullable|sometimes|boolean',


            'added.*.promos'                                       => 'nullable|sometimes|array',
            'added.*.promos.*.id'                                  => 'nullable|sometimes|integer',
            'added.*.promos.*.end_date'                            => 'nullable|sometimes|date',
            'added.*.promos.*.is_active'                           => 'nullable|sometimes|boolean',
            'added.*.promos.*.start_date'                          => 'nullable|sometimes|date',
            'added.*.promos.*.text_long'                           => 'nullable|sometimes|string',
            'added.*.promos.*.title'                               => 'nullable|sometimes|string|max:255',


            'added.*.tariffdetails'                                => 'nullable|sometimes|array',
            'added.*.tariffdetails.*.id'                           => 'nullable|sometimes|integer',
            'added.*.tariffdetails.*.tariffAttributeGroupId'       => 'nullable|sometimes|integer',
            'added.*.tariffdetails.*.position'                     => 'nullable|sometimes|integer',
            'added.*.tariffdetails.*.name'                         => 'nullable|sometimes|string|max:255',
            'added.*.tariffdetails.*.uniqueId'                     => 'nullable|sometimes|string|max:255',

            'added.*.tariffdetails.*.attributs'                    => 'nullable|sometimes|array',
            'added.*.tariffdetails.*.attributs.*.id'               => 'nullable|sometimes|integer|exists:tariff_attributes,id',
            'added.*.tariffdetails.*.attributs.*.code'             => 'nullable|sometimes|string|max:255',
            'added.*.tariffdetails.*.attributs.*.position'         => 'nullable|sometimes|integer',
            'added.*.tariffdetails.*.attributs.*.is_active'        => 'nullable|sometimes|boolean',
            'added.*.tariffdetails.*.attributs.*.name'             => 'nullable|sometimes|string|max:255',
            'added.*.tariffdetails.*.attributs.*.unit'             => 'nullable|sometimes|string|max:255',
            'added.*.tariffdetails.*.attributs.*.value_text'       => 'nullable|sometimes|string',
            'added.*.tariffdetails.*.attributs.*.value_varchar'    => 'nullable|sometimes|string|max:255',


            'added.*.tpl'                                          => 'nullable|sometimes|array',
            'added.*.tpl.*.autoFieldName'                          => 'nullable|sometimes|boolean',
            'added.*.tpl.*.autoUnit'                               => 'nullable|sometimes|boolean',
            'added.*.tpl.*.autoValueSource'                        => 'nullable|sometimes|boolean',
            'added.*.tpl.*.customFild'                             => 'nullable|sometimes|boolean',
            'added.*.tpl.*.icon'                                   => 'nullable|sometimes|string|max:255',
            'added.*.tpl.*.id'                                     => 'nullable|sometimes|integer',
            'added.*.tpl.*.isMatrix'                               => 'nullable|sometimes|boolean',
            'added.*.tpl.*.isHtml'                                 => 'nullable|sometimes|boolean',
            'added.*.tpl.*.manualFieldName'                        => 'nullable|sometimes|string|max:255',
            'added.*.tpl.*.manualUnit'                             => 'nullable|sometimes|string|max:255',
            'added.*.tpl.*.manualValue'                            => 'nullable|sometimes|string|max:255',
            'added.*.tpl.*.manualValueHtml'                        => 'nullable|sometimes|string',
            'added.*.tpl.*.position'                               => 'nullable|sometimes|integer',
            'added.*.tpl.*.showFieldName'                          => 'nullable|sometimes|boolean',
            'added.*.tpl.*.showIcon'                               => 'nullable|sometimes|boolean',
            'added.*.tpl.*.showUnit'                               => 'nullable|sometimes|boolean',
            'added.*.tpl.*.showValue'                              => 'nullable|sometimes|boolean',

            'added.*.tpl.*.matrix.*.id'                            => 'nullable|sometimes|integer',
            'added.*.tpl.*.matrix.*.name'                          => 'nullable|sometimes|string|max:255',
            'added.*.tpl.*.matrix.*.total_value'                   => 'nullable|sometimes|numeric',
            'added.*.tpl.*.matrix.*.uniqueId'                      => 'nullable|sometimes|string|max:255',
            'added.*.tpl.*.matrix.*.unit'                          => 'nullable|sometimes|string|max:255',

            'added.*.tpl.*.attribute.*.id'                         => 'nullable|sometimes|integer|exists:tariff_attributes,id',
            'added.*.tpl.*.attribute.*.code'                       => 'nullable|sometimes|string|max:255',
            'added.*.tpl.*.attribute.*.is_active'                  => 'nullable|sometimes|boolean',
            'added.*.tpl.*.attribute.*.name'                       => 'nullable|sometimes|string|max:255',
            'added.*.tpl.*.attribute.*.unit'                       => 'nullable|sometimes|string|max:255',
            'added.*.tpl.*.attribute.*.value_text'                 => 'nullable|sometimes|string',
            'added.*.tpl.*.attribute.*.value_varchar'              => 'nullable|sometimes|string|max:255',

            //deleted
            'deleted'                                      => 'nullable|array',
            'deleted.*.tariff'                             => 'nullable|sometimes|array',
            'deleted.*.tariff.*.id'                        => 'nullable|integer|exists:tariffs,id',
            'deleted.*.tariff.*.external_id'               => 'nullable|sometimes|string|max:255',
            'deleted.*.tariff.*.name_short'                => 'nullable|sometimes|string|max:255',
            'deleted.*.tariff.*.name'                      => 'nullable|sometimes|string|max:255',
            'deleted.*.tariff.*.provider_id'               => 'nullable|sometimes|integer|exists:tariff_providers,id',
            'deleted.*.tariff.*.network_operator_id'       => 'nullable|sometimes|integer|exists:tariff_network_operators,id',
            'deleted.*.tariff.*.note'                      => 'nullable|sometimes|string',
            'deleted.*.tariff.*.file_id'                   => 'nullable|sometimes|integer|exists:product_documents,id',
            'deleted.*.tariff.*.file_name'                 => 'nullable|sometimes|string|max:255',
            'deleted.*.tariff.*.group_id'                  => 'nullable|sometimes|integer|exists:tariff_groups,id',
            'deleted.*.tariff.*.is_published'              => 'nullable|sometimes|integer|boolean',
            'deleted.*.tariff.*.status_id'                 => 'nullable|sometimes|integer|exists:tariff_statuses,id',


            'deleted.*.attribute_groups'                             => 'nullable|sometimes|array',
            'deleted.*.attribute_groups.*.id'                        => 'nullable|sometimes|integer|exists:tariff_attribute_groups,id',
            'deleted.*.attribute_groups.*.name'                      => 'nullable|sometimes|string|max:255',
            'deleted.*.attribute_groups.*.uniqueId'                  => 'nullable|sometimes|string|max:255',

            'deleted.*.attribute_groups.*.attributs'                 => 'nullable|sometimes|array',
            'deleted.*.attribute_groups.*.attributs.*.id'            => 'nullable|sometimes|integer|exists:tariff_attributes,id',
            'deleted.*.attribute_groups.*.attributs.*.code'          => 'nullable|sometimes|string|max:255',
            'deleted.*.attribute_groups.*.attributs.*.is_active'     => 'nullable|sometimes|boolean',
            'deleted.*.attribute_groups.*.attributs.*.position'      => 'nullable|sometimes|integer',
            'deleted.*.attribute_groups.*.attributs.*.name'          => 'nullable|sometimes|string|max:255',
            'deleted.*.attribute_groups.*.attributs.*.unit'          => 'nullable|sometimes|string|max:255',
            'deleted.*.attribute_groups.*.attributs.*.value_text'    => 'nullable|sometimes|string',
            'deleted.*.attribute_groups.*.attributs.*.value_varchar' => 'nullable|sometimes|string|max:255',


            'deleted.*.calc_matrix'                                  => 'nullable|sometimes|array',
            'deleted.*.calc_matrix.*.id'                             => 'nullable|sometimes|integer',
            'deleted.*.calc_matrix.*.name'                           => 'nullable|sometimes|string|max:255',
            'deleted.*.calc_matrix.*.total_value'                    => 'nullable|sometimes|numeric',
            'deleted.*.calc_matrix.*.uniqueId'                       => 'nullable|sometimes|string|max:255',
            'deleted.*.calc_matrix.*.unit'                           => 'nullable|sometimes|string|max:255',

            'deleted.*.calc_matrix.*.attributs'                      => 'nullable|sometimes|array',
            'deleted.*.calc_matrix.*.attributs.*.id'                 => 'nullable|sometimes|integer|exists:tariff_attributes,id',
            'deleted.*.calc_matrix.*.attributs.*.code'               => 'nullable|sometimes|string|max:255',
            'deleted.*.calc_matrix.*.attributs.*.name'               => 'nullable|sometimes|string|max:255',
            'deleted.*.calc_matrix.*.attributs.*.period'             => 'nullable|sometimes|string|max:255',
            'deleted.*.calc_matrix.*.attributs.*.periodeTyp'         => 'nullable|sometimes|string|max:255',
            'deleted.*.calc_matrix.*.attributs.*.single'             => 'nullable|sometimes|boolean',
            'deleted.*.calc_matrix.*.attributs.*.position'           => 'nullable|sometimes|integer',
            'deleted.*.calc_matrix.*.attributs.*.unit'               => 'nullable|sometimes|string|max:255',
            'deleted.*.calc_matrix.*.attributs.*.value'              => 'nullable|sometimes|string',
            'deleted.*.calc_matrix.*.attributs.*.value_total'        => 'nullable|sometimes|numeric',


            'deleted.*.categories'                                   => 'nullable|sometimes|array',
            'deleted.*.categories.*.id'                              => 'nullable|sometimes|integer|exists:tariff_categories,id',
            'deleted.*.categories.*.name'                            => 'nullable|sometimes|string|max:255',
            'deleted.*.categories.*.checked'                         => 'nullable|sometimes|boolean',


            'deleted.*.combo_status'                                 => 'nullable|sometimes|array',
            'deleted.*.combo_status.*.id'                            => 'nullable|sometimes|integer|exists:tariff_combo_statuses,id',
            'deleted.*.combo_status.*.name'                          => 'nullable|sometimes|string|max:255',
            'deleted.*.combo_status.*.checked'                       => 'nullable|sometimes|boolean',


            'deleted.*.promos'                                       => 'nullable|sometimes|array',
            'deleted.*.promos.*.id'                                  => 'nullable|sometimes|integer',
            'deleted.*.promos.*.end_date'                            => 'nullable|sometimes|date',
            'deleted.*.promos.*.is_active'                           => 'nullable|sometimes|boolean',
            'deleted.*.promos.*.start_date'                          => 'nullable|sometimes|date',
            'deleted.*.promos.*.text_long'                           => 'nullable|sometimes|string',
            'deleted.*.promos.*.title'                               => 'nullable|sometimes|string|max:255',


            'deleted.*.tariffdetails'                                => 'nullable|sometimes|array',
            'deleted.*.tariffdetails.*.id'                           => 'nullable|sometimes|integer',
            'deleted.*.tariffdetails.*.tariffAttributeGroupId'       => 'nullable|sometimes|integer',
            'deleted.*.tariffdetails.*.position'                     => 'nullable|sometimes|integer',
            'deleted.*.tariffdetails.*.name'                         => 'nullable|sometimes|string|max:255',
            'deleted.*.tariffdetails.*.uniqueId'                     => 'nullable|sometimes|string|max:255',

            'deleted.*.tariffdetails.*.attributs'                    => 'nullable|sometimes|array',
            'deleted.*.tariffdetails.*.attributs.*.id'               => 'nullable|sometimes|integer|exists:tariff_attributes,id',
            'deleted.*.tariffdetails.*.attributs.*.code'             => 'nullable|sometimes|string|max:255',
            'deleted.*.tariffdetails.*.attributs.*.is_active'        => 'nullable|sometimes|boolean',
            'deleted.*.tariffdetails.*.attributs.*.position'         => 'nullable|sometimes|integer',
            'deleted.*.tariffdetails.*.attributs.*.name'             => 'nullable|sometimes|string|max:255',
            'deleted.*.tariffdetails.*.attributs.*.unit'             => 'nullable|sometimes|string|max:255',
            'deleted.*.tariffdetails.*.attributs.*.value_text'       => 'nullable|sometimes|string',
            'deleted.*.tariffdetails.*.attributs.*.value_varchar'    => 'nullable|sometimes|string|max:255',


            'deleted.*.tpl'                                          => 'nullable|sometimes|array',
            'deleted.*.tpl.*.autoFieldName'                          => 'nullable|sometimes|boolean',
            'deleted.*.tpl.*.autoUnit'                               => 'nullable|sometimes|boolean',
            'deleted.*.tpl.*.autoValueSource'                        => 'nullable|sometimes|boolean',
            'deleted.*.tpl.*.customFild'                             => 'nullable|sometimes|boolean',
            'deleted.*.tpl.*.icon'                                   => 'nullable|sometimes|string|max:255',
            'deleted.*.tpl.*.id'                                     => 'nullable|sometimes|integer',
            'deleted.*.tpl.*.isMatrix'                               => 'nullable|sometimes|boolean',
            'deleted.*.tpl.*.isHtml'                                 => 'nullable|sometimes|boolean',
            'deleted.*.tpl.*.manualFieldName'                        => 'nullable|sometimes|string|max:255',
            'deleted.*.tpl.*.manualUnit'                             => 'nullable|sometimes|string|max:255',
            'deleted.*.tpl.*.manualValue'                            => 'nullable|sometimes|string|max:255',
            'deleted.*.tpl.*.manualValueHtml'                        => 'nullable|sometimes|string',
            'deleted.*.tpl.*.position'                               => 'nullable|sometimes|integer',
            'deleted.*.tpl.*.showFieldName'                          => 'nullable|sometimes|boolean',
            'deleted.*.tpl.*.showIcon'                               => 'nullable|sometimes|boolean',
            'deleted.*.tpl.*.showUnit'                               => 'nullable|sometimes|boolean',
            'deleted.*.tpl.*.showValue'                              => 'nullable|sometimes|boolean',

            'deleted.*.tpl.*.matrix.*.id'                            => 'nullable|sometimes|integer',
            'deleted.*.tpl.*.matrix.*.name'                          => 'nullable|sometimes|string|max:255',
            'deleted.*.tpl.*.matrix.*.total_value'                   => 'nullable|sometimes|numeric',
            'deleted.*.tpl.*.matrix.*.uniqueId'                      => 'nullable|sometimes|string|max:255',
            'deleted.*.tpl.*.matrix.*.unit'                          => 'nullable|sometimes|string|max:255',

            'deleted.*.tpl.*.attribute.*.id'                         => 'nullable|sometimes|integer|exists:tariff_attributes,id',
            'deleted.*.tpl.*.attribute.*.code'                       => 'nullable|sometimes|string|max:255',
            'deleted.*.tpl.*.attribute.*.is_active'                  => 'nullable|sometimes|boolean',
            'deleted.*.tpl.*.attribute.*.name'                       => 'nullable|sometimes|string|max:255',
            'deleted.*.tpl.*.attribute.*.unit'                       => 'nullable|sometimes|string|max:255',
            'deleted.*.tpl.*.attribute.*.value_text'                 => 'nullable|sometimes|string',
            'deleted.*.tpl.*.attribute.*.value_varchar'              => 'nullable|sometimes|string|max:255',
        ];
    }
}