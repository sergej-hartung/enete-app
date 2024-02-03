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
use App\Http\Requests\User\Profile\StoreProfileRequest;

class StoreController extends Controller
{
    public function __invoke(StoreProfileRequest $request)
    {
        try {
            // dd($request->file());
            // dd($request->validated());
            DB::beginTransaction();

            $addresses = false;
            $banks = false;
            $contacts = false;

            $data = $request->validated();
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

            $profile = UserProfile::create($data);

            if ($addresses && is_array($addresses)) {
                foreach ($addresses as $address) {
                    $profile->addresses()->create($address);
                }
            }

            if ($banks && is_array($banks)) {
                foreach ($banks as $bank) {
                    $profile->banks()->create($bank);
                }
            }

            if($contacts && is_array($contacts)){
                foreach($contacts as $contact){
                    $profile->contacts()->create($contact);
                }
            }

            //return response([], 201);

            DB::commit();
        } catch (\Exception $exception) {
            return $exception->getMessage();
        }

        return response('', 201);
    }
}
