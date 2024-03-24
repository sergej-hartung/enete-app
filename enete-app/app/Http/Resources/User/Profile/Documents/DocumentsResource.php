<?php

namespace App\Http\Resources\User\Profile\Documents;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentsResource extends JsonResource
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
            'name'                             => $this->name,
            'size'                             => $this->size ,
            'type'                             => $this->type,
            'created_by'                       => $this->created_by,
            'updated_by'                       => $this->updated_by,
        ];
    }
}