<?php

namespace App\Http\Resources\User\Profile\Admins;

use Illuminate\Http\Request;
use App\Http\Resources\User\User\UserResource;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\User\Profile\EmployeeDetails\Status\IndexStatusResource;

class IndexAdminProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //$employee = $this->employee->first();
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'accesses' => UserResource::collection($this->users),
            //'status' => $employee ? new IndexStatusResource($employee->status) : null
        ];
    }
}
