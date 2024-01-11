<?php

namespace App\Http\Resources\User\Profile;

use Illuminate\Http\Request;
use App\Http\Resources\User\User\UserResource;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\User\Profile\Status\StatusResource;

class IndexProfileResource extends JsonResource
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
            'vp_nr' => $this->vp_nr,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'accesses' => UserResource::collection($this->users),
            'status' => new StatusResource($this->status)
        ];
    }
}
