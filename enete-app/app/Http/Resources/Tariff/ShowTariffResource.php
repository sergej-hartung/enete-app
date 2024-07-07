<?php

namespace App\Http\Resources\Tariff;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Tariff\AttributeGroup\IndexTariffAttributeGroupResource;
use App\Http\Resources\Tariff\ComboStatus\IndexTariffComboStatusResource;
use App\Http\Resources\Tariff\Category\IndexTariffCategoryResource;

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
            'status'           => $this->status,
            'has_action'          => $this->has_action,
            'action_group_id'     => $this->action_group_id,
            'is_published'       => $this->is_published,
            'note'       => $this->note,
            'file_id'       => $this->file_id,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'attribute_groups' => IndexTariffAttributeGroupResource::collection($this->attributeGroups),
            'combo_status' => IndexTariffComboStatusResource::collection($this->comboStatus),
            'tariff_categories' => IndexTariffCategoryResource::collection($this->category)
        ];
    }
}
