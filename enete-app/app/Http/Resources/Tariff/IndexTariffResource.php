<?php

namespace App\Http\Resources\Tariff;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IndexTariffResource extends JsonResource
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
            'calculated_value'    => $this->calculated_value,
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
        ];
    }
}
