<?php

namespace App\Http\Resources\User\Profile\Employees;

use Illuminate\Http\Request;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\User\User\UserResourceExpanded;
use App\Http\Resources\User\Profile\Banks\BankResource;
use App\Http\Resources\User\Profile\Address\AddressResource;
use App\Http\Resources\User\Profile\Contacts\ContactsResource;
use App\Http\Resources\User\Profile\Documents\DocumentsResource;
use App\Http\Resources\User\Profile\Employees\EmployeeDetails\EmployeeDetailsResource;

class ShowEmployeeProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    { 
        //dd($this);
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
            "parent_id"                 => $this->parent_id,
            "employee_details"          => new EmployeeDetailsResource($this->employee),
            "addresses"                 => AddressResource::collection($this->addresses),
            "contacts"                  => ContactsResource::collection($this->contacts),
            "banks"                     => BankResource::collection($this->banks),
            "users"                     => UserResourceExpanded::collection($this->users),
            "documents"                 => DocumentsResource::collection($this->documents),
            "parent"                    => $this->whenLoaded('parent', function() {
                return $this->parent->employee->vp_nr . ' ' . $this->parent->first_name . ' ' . $this->parent->last_name;
            }),
        ];
    }
}