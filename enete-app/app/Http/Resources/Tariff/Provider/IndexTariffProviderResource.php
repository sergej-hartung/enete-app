<?php

namespace App\Http\Resources\Tariff\Provider;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\ProductDocument\IndexProductDokumetResource;

class IndexTariffProviderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'name'               => $this->name,
            'logo_id'            => $this->logo_id,
            'file_name'          => $this->whenLoaded('document', function(){
                return $this->document->original_name;
            }),
            'tariff_group_ids'   => $this->whenLoaded('groups', function () {
                return $this->groups->pluck('id');
            }),
            'is_filled_on_site'  => $this->is_filled_on_site,
            'external_fill_link' => $this->external_fill_link,
            'created_by'         => $this->created_by,
            'updated_by'         => $this->updated_by,
            'created_at'         => $this->created_at,
            'updated_at'         => $this->updated_at,
        ];
    }
}
