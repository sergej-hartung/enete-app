<?php

namespace App\Http\Resources\Tariff;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Tariff\AttributeGroup\IndexTariffAttributeGroupResource;
use App\Http\Resources\Tariff\ComboStatus\IndexTariffComboStatusResource;
use App\Http\Resources\Tariff\Category\IndexTariffCategoryResource;
use App\Http\Resources\ProductDocument\IndexProductDokumetResource;
use App\Http\Resources\Tariff\CalcMatrix\IndexCalcMatrixResource;
use App\Http\Resources\Tariff\Promo\IndexTariffPromoResource;
use App\Http\Resources\Tariff\Tpl\IndexTariffTplResource;
use App\Http\Resources\Tariff\Detail\TariffDetailWithAttributesResource;
use App\Http\Resources\Tariff\Sorting\IndexTariffSortingWithPivotResource;

class ShowTariffResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'external_id'         => $this->external_id,
            'name'                => $this->name,
            'name_short'          => $this->name_short,
            //'provider_id'         => $this->provider_id,
            'provider'            => $this->provider,
            //'network_operator_id' => $this->network_operator_id,
            'network_operator'    => $this->networkOperator,
            'group_id'            => $this->group_id,
            //'group'               => $this->group,
            //'status_id'           => $this->status_id,
            'status'              => $this->status,
            'has_action'          => $this->has_action,
            'action_group_id'     => $this->action_group_id,
            'is_published'        => $this->is_published,
            'note'                => $this->note,
            'file_id'             => $this->file_id,
            'period'              => $this->period,
            'periodeTyp'          => $this->periodeTyp,
            'calc_matrix'         => IndexCalcMatrixResource::collection($this->whenLoaded('clacMatrices')),
            'created_by'          => $this->created_by,
            'updated_by'          => $this->updated_by,
            'created_at'          => $this->created_at,
            'updated_at'          => $this->updated_at,

            'attribute_groups'    => IndexTariffAttributeGroupResource::collection($this->whenLoaded('attributeGroups')),
            'combo_status'        => IndexTariffComboStatusResource::collection($this->whenLoaded('comboStatus')),
            'tariff_categories'   => IndexTariffCategoryResource::collection($this->whenLoaded('category')),
            'promos'              => IndexTariffPromoResource::collection($this->whenLoaded('promotions')),
            'tpl'                 => IndexTariffTplResource::collection($this->whenLoaded('tariffTpls')),
            // 'tariffdetails'       => TariffDetailWithAttributesResource::collection($this->whenLoaded('tariffDetails')),
            'tariffdetails'       => $this->whenLoaded('tariffDetails', function () {
                return $this->tariffDetails->map(function ($tariffDetail) {
                    return new TariffDetailWithAttributesResource($tariffDetail, $this->id);
                });
            }),
            'document'            => new IndexProductDokumetResource($this->whenLoaded('document')),
            'sortings'            => IndexTariffSortingWithPivotResource::collection($this->whenLoaded('sorting'))
        ];
    }
}
