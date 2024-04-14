<?php

namespace App\Http\Resources\User\Profile\Employees;

use Illuminate\Http\Request;
use App\Http\Resources\User\User\UserResource;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\User\Profile\Employees\EmployeeDetails\Status\IndexStatusResource;

class ParentEmployeeProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //dd($this->employee->vp_nr);
        //dd(new IndexStatusResource());
        return [
            'id' => $this->id,
            'vp_nr' => $this->employee ? $this->employee->vp_nr : null,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
        ];
    }
}
