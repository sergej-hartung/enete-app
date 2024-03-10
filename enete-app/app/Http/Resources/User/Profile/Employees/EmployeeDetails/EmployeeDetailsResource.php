<?php

namespace App\Http\Resources\User\Profile\Employees\EmployeeDetails;

use Illuminate\Http\Request;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\User\User\UserResourceExpanded;
use App\Http\Resources\User\Profile\Banks\BankResource;
use App\Http\Resources\User\Profile\Address\AddressResource;
use App\Http\Resources\User\Profile\Contacts\ContactsResource;

class EmployeeDetailsResource extends JsonResource
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
            "user_profile_id"          => $this->user_profile_id ,
            "vp_nr"                     => $this->vp_nr,
            "egon_nr"                     => $this->egon_nr,
            "company"                   =>  $this->company,
            "marital_status"            => $this->marital_status,
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
            "status_id"                 => $this->status_id,
            "career_id"                 => $this->career_id,
            "categorie_id"              => $this->categorie_id,
        ];
    }
}