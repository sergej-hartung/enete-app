<?php

namespace App\Http\Resources\User\Profile\Admins;

use Illuminate\Http\Request;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\User\User\UserResourceExpanded;
use App\Http\Resources\User\Profile\Address\AddressResource;
use App\Http\Resources\User\Profile\Contacts\ContactsResource;

class ShowAdminProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"                        => $this->id,
            "salutation"                => $this->salutation,
            "title"                     =>  $this->title,
            "first_name"                => $this->first_name,
            "last_name"                 => $this->last_name,
            "birthdate"                 => $this->birthdate,
            "email"                     => $this->email,
            "internal_note"             => $this->internal_note,
            "external_note"             => $this->external_note,
            "addresses"                 => AddressResource::collection($this->addresses),
            "contacts"                  => ContactsResource::collection($this->contacts),
            "users"                     => UserResourceExpanded::collection($this->users),
        ];
    }
}