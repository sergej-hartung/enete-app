<?php

namespace App\Http\Resources\User\Profile\Address;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_profile_id '                 => $this->user_profile_id,
            'user_profile_address_category_id' => $this->user_profile_address_category_id,
            'zip'                              => $this->zip,
            'city'                             => $this->city,
            'street'                           => $this->street,
            'house_number'                     => $this->house_number,
            'country'                          => $this->country,
            'created_by'                       => $this->created_by,
            'updated_by'                       => $this->updated_by,
        ];
    }
}
