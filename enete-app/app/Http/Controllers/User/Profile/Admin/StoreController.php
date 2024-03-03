<?php

namespace App\Http\Controllers\User\Profile\Admin;

use App\Mail\VerifyEmail;
use App\Mail\SendLoginDetails;
use App\Models\User\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\User\UserProfile;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\User\Profile\Employee\StoreAdminProfileRequest;
use Illuminate\Support\Facades\Storage;

class StoreController extends Controller
{
    public function __invoke(StoreAdminProfileRequest $request)
    {
        try {
              //dd($request->file());
              //dd($request->validated());
            DB::beginTransaction();

            $addresses = false;
            $banks = false;
            $contacts = false;
            $users = false;
            $avatarPaths = [];         

            $data = $request->validated();

            dd($data);

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
            if (isset($data['users'])) {
                $users = $data['users'];
                unset($data['users']);
            }
            $data['email_verification_hash'] = md5(Str::random(40));

            $profile = UserProfile::create($data);
            $this->SentEmailVerificationHash($profile);

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

            if($users && is_array($users)){
                foreach($users as $key => $user){
                    try{
                        //dd($user);
                        if(isset($request->file()['users'][$key]['avatar'])){
                            $avatar = $request->file()['users'][$key]['avatar'];
                            $path = Storage::disk('public')->put('avatars', $avatar);
                            if ($path === false) {
                                throw new \Exception("Error saving avatar file.");
                            }
                            $user['avatar'] = url(Storage::url($path));
                            $avatarPaths[] = $path;
                        }
                        $password = $user['password'];
                        $user['password'] = Hash::make($user['password']);
                        $user = $profile->users()->create($user);
                        //dd($user);
                        Mail::to($profile->email)->send(new SendLoginDetails($user, $password));
                        $user->access_data_sent = now();
                        $user->save();

                    }catch(\Exception $e){
                        DB::rollBack();
                        // Удаляем все файлы, которые уже могли быть сохранены
                        foreach ($avatarPaths as $path) {
                            if (Storage::disk('public')->exists($path)) {
                                Storage::disk('public')->delete($path);
                            }
                        }

                        return response()->json(['error' => $e->getMessage()], 500);
                    }
                     
                }
            }

            //return response([], 201);

            DB::commit();
            return response('', 201);

        } catch (\Exception $exception) {
            DB::rollBack();

            foreach ($avatarPaths as $path) {
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }
            return $exception->getMessage();
        }      
    }

    private function SentEmailVerificationHash ($profile ){
        if($profile){
            Mail::to($profile->email)->send(new VerifyEmail($profile));
            $profile->email_sent = now();
            $profile->save();
        }       
    }
}
