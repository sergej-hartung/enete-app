<?php

namespace App\Http\Controllers\User\Profile;

use App\Mail\VerifyEmail;
use App\Models\User\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\User\UserProfile;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\User\Profile\UpdateProfileRequest;
use App\Http\Resources\User\Profile\UpdateProfileResource;

class UpdateController extends Controller
{
    public function __invoke(UpdateProfileRequest $request, $id)
    {
        try {
            DB::beginTransaction();

            $addresses = false;
            $banks = false;
            $contacts = false;

            $data = $request->validated();
            $userProfile = UserProfile::findOrFail($request->id);
            
            if (isset($data['addresses'])) {
                $addresses = $data['addresses'];
                unset($data['addresses']);
            }
            if (isset($data['banks'])) {
                $banks = $data['banks'];
                unset($data['banks']);
            }
            if (isset($data['contacts'])) {
                $contacts = $data['contacts'];
                unset($data['contacts']);
            }
            
            $userProfile->update($data);

            if ($addresses && is_array($addresses)) {
                foreach ($addresses as $addressData) {
                    $userProfile->addresses()->updateOrCreate(['id' => $addressData['id'] ?? null], $addressData);
                }
            }

            if ($banks && is_array($banks)) {
                foreach ($banks as $bankData) {
                    $userProfile->banks()->updateOrCreate(['id' => $bankData['id'] ?? null], $bankData);
                }
            }

            if($contacts && is_array($contacts)){
                foreach ($contacts as $contactData) {
                    $userProfile->contacts()->updateOrCreate(['id' => $contactData['id'] ?? null], $contactData);
                }
            }

            $userProfile->fresh();

            $userProfile->with('addresses', 'banks', 'contacts', 'status', 'parent', 'users');

            DB::commit();
            //return response($userProfile);
            return new UpdateProfileResource($userProfile);
            
        } catch (\Exception $exception) {
            return $exception->getMessage();
        }

        
    }
}
