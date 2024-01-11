<?php

namespace App\Http\Resources\User\Profile\Banks;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BankResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                             => $this->id,
            'user_profile_id'                => $this->user_profile_id ,
            'salutation'                     => $this->salutation,
            'first_name'                     => $this->first_name ,
            'last_name'                      => $this->last_name,
            'zip'                            => $this->zip,
            'city'                           => $this->city,
            'street'                         => $this->street,
            'house_number'                   => $this->house_number,
            'country'                        => $this->country,
            'bic'                            => $this->bic,
            'iban'                           => $this->iban,
            'bank_name'                      => $this->bank_name,
            'user_profile_bank_categorie_id' => $this->user_profile_bank_categorie_id ,
            'created_by '                    => $this->created_by ,
            'updated_by '                    => $this->updated_by ,
        ];
    }
}