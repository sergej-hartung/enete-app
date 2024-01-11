<?php

namespace App\Http\Resources\User\Profile\Contacts;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                               => $this->id,
            'user_profile_id'                  => $this->user_profile_id,
            'user_profile_contact_category_id' => $this->user_profile_contact_category_id,
            'user_profile_contact_type_id'     => $this->user_profile_contact_type_id ,
            'prefix'                           => $this->prefix,
            'number'                           => $this->number,
            'created_by'                       => $this->created_by,
            'updated_by'                       => $this->updated_by,
        ];
    }
}
