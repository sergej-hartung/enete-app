<?php

namespace App\Http\Resources\User\Profile\Admin;

use Illuminate\Http\Request;

use App\Http\Resources\User\User\UserResourceExpanded;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\User\Profile\Banks\BankResource;
use App\Http\Resources\User\Profile\Address\AddressResource;
use App\Http\Resources\User\Profile\Contacts\ContactsResource;
use App\Http\Resources\User\Profile\Status\IndexStatusResource;

class UpdateProfileResource extends JsonResource
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
            "vp_nr"                     => $this->vp_nr,
            "egon_nr"                     => $this->egon_nr,
            "company"                   =>  $this->company,
            "salutation"                => $this->salutation,
            "title"                     =>  $this->title,
            "first_name"                => $this->first_name,
            "last_name"                 => $this->last_name,
            "marital_status"            => $this->marital_status,
            "birthdate"                 => $this->birthdate,
            "email"                     => $this->email,
            //"email_sent" => $this->email_sent,
            //"email_verification_hash" =>  $this->email_verification_hash,
            //"email_verified_at" => $this->email_verified_at,
            "id_card"                   => $this->id_card,
            "business_registration"     => $this->business_registration,
            "sales_tax_liability"       => $this->sales_tax_liability,
            "vat_liability_proven"      => $this->vat_liability_proven,
            "tax_number"                => $this->tax_number,
            "tax_id"                    => $this->tax_id,
            "tax_office"                => $this->tax_office,
            "datev_no"                  => $this->datev_no,
            "entrance"                  => $this->entrance,
            "entry"                     => $this->entry,
            "exit"                      => $this->exit,
            "billing_blocked"           => $this->billing_blocked,
            "payout_blocked"            => $this->payout_blocked,
            "internal_note"             => $this->internal_note,
            "external_note"             => $this->external_note,
            "status_id"                 => $this->status_id,
            "career_id"                 => $this->career_id,
            "user_profile_categorie_id" => $this->user_profile_categorie_id,
            "parent_id"                 => $this->parent_id,
            "status"                    => new IndexStatusResource($this->status),
            'users'                     => UserResourceExpanded::collection($this->users),
            "addresses"                 => AddressResource::collection($this->addresses),
            "contacts"                  => ContactsResource::collection($this->contacts),
            "banks"                     => BankResource::collection($this->banks),
            "parent"                    => $this->whenLoaded('parent', function() {
                return $this->parent->vp_nr . ' ' . $this->parent->first_name . ' ' . $this->parent->last_name;
            }),
        ];
    }
}
