<?php

namespace App\Http\Resources\User\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResourceExpanded extends JsonResource
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
            'user_profile_id' => $this->user_profile_id,
            'login_name' => $this->login_name,
            'role_id' => $this->role_id,           
            'avatar' => $this->avatar,           
            'access_data_sent' => $this->access_data_sent,           
            'status_id' => $this->status_id,
            'status' => $this->status,
            'last_visit' => $this->last_visit,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
