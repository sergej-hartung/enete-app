<?php

namespace App\Http\Resources\Tariff\NetworkOperator;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IndexTariffNetworkOperatorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return [
        //     'id' => $this->id,
        //     'name' => $this->name,
        //     'logo_id' => $this->logo,
        //     'created_by' => $this->created_by,
        //     'updated_by' => $this->updated_by,
        //     'created_at' => $this->created_at,
        //     'updated_at' => $this->updated_at,
        // ];

        return [
            'id'                     => $this->id,
            'name'                   => $this->name,
            'logo_id'                => $this->logo_id,
            'file_name'              => $this->whenLoaded('document', function(){
                return $this->document->original_name;
            }),
            'tariff_group_ids'       => $this->whenLoaded('groups', function () {
                return $this->groups->pluck('id');
            }),
            'created_by'             => $this->created_by,
            'updated_by'             => $this->updated_by,
            'created_at'             => $this->created_at,
            'updated_at'             => $this->updated_at,
        ];
    }
}
