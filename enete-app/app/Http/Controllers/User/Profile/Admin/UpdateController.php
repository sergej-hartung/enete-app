<?php

namespace App\Http\Controllers\User\Profile\Admin;

use App\Mail\VerifyEmail;
use App\Models\User\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Mail\SendLoginDetails;
use App\Models\User\UserProfile;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\User\Profile\UpdateProfileRequest;
use App\Http\Resources\User\Profile\UpdateProfileResource;
use Illuminate\Support\Facades\Storage;

class UpdateController extends Controller
{
    public function __invoke(UpdateProfileRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            //dd($request->validated());
            $addresses = false;
            $banks = false;
            $contacts = false;
            $users = false;
            $userPassword = false;
            $modifyEmail = false;
            $avatarPaths = [];

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
            if (isset($data['users'])) {
                $users = $data['users'];
                unset($data['users']);
            }
            if(isset($data['email'])){
                $data['email_verification_hash'] = md5(Str::random(40));
                $modifyEmail = true;
            }
            
            if(count($data) !== 0){
                $userProfile->update($data);
            }
            
            if($modifyEmail){
                $userProfile->fresh();
                $this->SentEmailVerificationHash($userProfile);
            } 

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

            if($users && is_array($users)){
                foreach($users as $key => $user){
                    try{
                        
                        //dd($user);
                        if(isset($request->file()['users'][$key]['avatar'])){
                            $avatar = $request->file()['users'][$key]['avatar'];

                            // Проверяем, существует ли текущий аватар пользователя и удаляем его
                            $currentUser = $userProfile->users()->where('id', $user['id'] ?? null)->first();
                            if ($currentUser && $currentUser->avatar) {
                                $currentAvatarPath = str_replace(url('/') . '/storage', '', $currentUser->avatar);
                                Storage::disk('public')->delete($currentAvatarPath);
                            }

                            $path = Storage::disk('public')->put('avatars', $avatar);
                            if ($path === false) {
                                throw new \Exception("Error saving avatar file.");
                            }
                            $user['avatar'] = url(Storage::url($path));
                            $avatarPaths[] = $path;
                        }
                        if(isset($user['password'])){
                            $userPassword = $user['password'];
                            $user['password'] = Hash::make($user['password']);
                        }
                        
                        
                        $userObj = $userProfile->users()->updateOrCreate(['id' => $user['id'] ?? null], $user);
                        //dd($user);
                        if($userPassword){
                            $userProfile->fresh();
                            Mail::to($userProfile->email)->send(new SendLoginDetails($userObj, $userPassword));
                            $userObj->access_data_sent = now();
                            $userObj->save();
                        }
                        

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

            $userProfile->fresh();

            if ($userProfile->status_id == 3 || $userProfile->status_id == 4) {
                $users = $userProfile->users;
                if ($users) {
                    foreach ($users as $user) {
                        $user->status_id = 2;
                        $user->save();
                    }
                }
            }
            $userProfile->fresh();

            $userProfile->with('addresses', 'banks', 'contacts', 'status', 'parent', 'users');

            DB::commit();
            //return response($userProfile);
            return new UpdateProfileResource($userProfile);
            
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
