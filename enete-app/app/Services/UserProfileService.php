<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use App\Mail\VerifyEmail;
use App\Mail\SendLoginDetails;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User\UserProfile;
use App\Http\Filters\UserProfileFilter;

use App\Traits\HandlesUserProfile;

class UserProfileService{

    use HandlesUserProfile;

    protected $avatarPaths;
    protected $documentPaths;

    public function __construct() {
        $this->avatarPaths = collect();
    }

    public function getAdminProfiles(array $data){
        $filter = app()->make(UserProfileFilter::class, ['queryParams' => array_filter($data)]);
        $profiles = UserProfile::with(['users'])->where('user_type', '=', 'is_admin')->filter($filter)->sort($data)->get();

        $fieldsToDecrypt = ['first_name', 'last_name']; 
        foreach($profiles as $profile){
            $this->decryptFields($profile, $fieldsToDecrypt);
        }

        return $profiles;
    }

    public function findAdminProfilesById($profileId){
        $profile = UserProfile::with([
                'users', 
                'users.status',
                'addresses', 
                'contacts'
            ])->where('user_type', '=', 'is_admin')->find($profileId);

        if (!$profile) {
            return null;
        }

        //$fieldsToDecrypt = ['first_name', 'last_name'];
        $fieldsToDecrypt = [];

        // Конфигурация для связанных моделей
        $relationsToDecrypt = [
            'addresses' => ['zip', 'city', 'street', 'house_number', 'country'],
            //'banks' => ['first_name', 'last_name', 'zip', 'city', 'street', 'house_number', 'country', 'bic', 'iban', 'bank_name'],
            'contacts' => ['prefix', 'number']
        ];

        $this->decryptFields($profile, $fieldsToDecrypt, $relationsToDecrypt);

        return $profile;
    }

    public function createAdminProfile($request, $data){
        $data['user_type'] = 'is_admin';
        $extractedData = $this->extractData($data);
   
        $profile = $this->handleUserProfiles($extractedData);           
        $this->handleRelatedEntities($profile, $extractedData);   
        $this->sendEmailVerificationHash($profile);
            
        $this->handleUsers($request, $profile, $extractedData['users'] ?? []);
    }

    public function updateAdminProfile($request, $id, $data){
        
        $profile = UserProfile::findOrFail($id);
        $extractedData = $this->extractData($data);
        //dd($extractedData);
        $this->handleUserProfiles($extractedData, $profile, true);           
        $this->handleRelatedEntities($profile, $extractedData, true);
        $this->handleUsers($request, $profile, $extractedData['users'] ?? [], true);

        $profile->fresh();


        $profile = UserProfile::with('addresses', 'contacts', 'users.status', 'parent', 'users')->find($id);

        //$fieldsToDecrypt = ['first_name', 'last_name'];
        $fieldsToDecrypt = [];

        $relationsToDecrypt = [ // Конфигурация для связанных моделей
            'addresses' => ['zip', 'city', 'street', 'house_number', 'country'], // Поля для расшифровки в связанной модели 'addresses'
            //'banks' => ['first_name','last_name','zip', 'city', 'street', 'house_number', 'country', 'bic', 'iban', 'bank_name'],
            'contacts' => ['prefix', 'number']
        ];

        $this->decryptFields($profile, $fieldsToDecrypt, $relationsToDecrypt);
        //dd($profile);
        return $profile;

    }


    public function getEmployeeProfiles(array $data){
        $filter = app()->make(UserProfileFilter::class, ['queryParams' => array_filter($data)]);

        $profiles = UserProfile::with(['users', 'employee.status'])
            ->where('user_type', '=', 'is_employee')
            ->filter($filter)
            ->sort($data)
            ->get();

        $fieldsToDecrypt = ['first_name', 'last_name']; 
        foreach($profiles as $profile){
            $this->decryptFields($profile, $fieldsToDecrypt);
        }

        return $profiles;
    }

    public function findEmployeeProfilesById($profileId){

        $profile = UserProfile::with([
            'users', 
            'users.status',
            'parent',
            'addresses', 
            'contacts', 
            'banks', 
            'employee'
        ])->where('user_type', '=', 'is_employee')->find($profileId);
        
        if (!$profile) {
            return null;
        }

        //$this->decryptProfileFields($profile);// Поля для расшифровки в основной модели
        //$fieldsToDecrypt = ['first_name', 'last_name'];
        $fieldsToDecrypt = [];

        // Конфигурация для связанных моделей
        $relationsToDecrypt = [
            'addresses' => ['zip', 'city', 'street', 'house_number', 'country'],
            'banks' => ['first_name', 'last_name', 'zip', 'city', 'street', 'house_number', 'country', 'bic', 'iban', 'bank_name'],
            'contacts' => ['prefix', 'number']
        ];

        $this->decryptFields($profile, $fieldsToDecrypt, $relationsToDecrypt);

        return $profile;
    }

    public function createEmployeeProfile($request, $data){
        $data['user_type'] = 'is_employee';
        $extractedData = $this->extractData($data);
   
        $profile = $this->handleUserProfiles($extractedData);           
        $this->handleRelatedEntities($profile, $extractedData);   
        $this->sendEmailVerificationHash($profile);         
        $this->handleUsers($request, $profile, $extractedData['users'] ?? []);
        
    }

    public function updateEmployeeProfile($request, $id, $data){
        $profile = UserProfile::findOrFail($id);
        $extractedData = $this->extractData($data);
        //dd($extractedData);
        $this->handleUserProfiles($extractedData, $profile, true);           
        $this->handleRelatedEntities($profile, $extractedData, true);
        $this->handleUsers($request, $profile, $extractedData['users'] ?? [], true);
        $this->handleDocuments($request, $profile, $extractedData['documents'] ?? []);
        $profile->fresh();

        if ($profile->employee->status_id == 3 || $profile->employee->status_id == 4) {
            $users = $profile->users;
            if ($users) {
                foreach ($users as $user) {
                    $user->status_id = 2;
                    $user->save();
                }
            }
        }

        $profile = UserProfile::with('addresses', 'banks', 'contacts', 'users.status', 'parent', 'users')->find($id);

        $fieldsToDecrypt = ['first_name', 'last_name']; // Поля для расшифровки в основной модели
        $relationsToDecrypt = [ // Конфигурация для связанных моделей
            'addresses' => ['zip', 'city', 'street', 'house_number', 'country'], // Поля для расшифровки в связанной модели 'addresses'
            'banks' => ['first_name','last_name','zip', 'city', 'street', 'house_number', 'country', 'bic', 'iban', 'bank_name'],
            'contacts' => ['prefix', 'number']
        ];

        $this->decryptFields($profile, $fieldsToDecrypt, $relationsToDecrypt);
        //dd($profile);
        return $profile;

    }


    public function extractData(array $data){
        return [
            'employee_details' => Arr::pull($data, 'employee_details', []),
            'addresses' => Arr::pull($data, 'addresses', []),
            'banks' => Arr::pull($data, 'banks', []),
            'contacts' => Arr::pull($data, 'contacts', []),
            'users' => Arr::pull($data, 'users', []),
            'documents' => Arr::pull($data, 'documents', []),
            'user_profile' => $data
        ];
    }


    public function handleUserProfiles($entities, UserProfile $profile = null, bool $update = false){

        $value = $entities['user_profile'];

        if($update && $profile){
            if(isset($value['email'])){
                $value['email_verification_hash'] = hash('sha256', Str::random(40));
                $this->sendEmailVerificationHash($profile);
            }
            $profile->update($value);
        }else{
            $value['email_verification_hash'] = hash('sha256', Str::random(40));

            return UserProfile::create($value);
        }
        
    }

    public function handleRelatedEntities(UserProfile $profile, $entities, $update = false){
        foreach ($entities as $entityKey => $entityValue) {
            if (!$entityValue || !is_array($entityValue)) {
                continue;
            }

            // Определение типа связанных данных и их обработка
            switch ($entityKey) {

                case 'employee_details':
                    
                    if($update){                 
                        $profile->employee()->updateOrCreate(['id' => $entityValue['id'] ?? null], $entityValue);
                    }else{
                        $profile->employee()->create($entityValue);
                    }
                    
                    break;
                case 'addresses':

                    foreach ($entityValue as &$value) {
                        $value = $this->encryptExcept(
                            $value, 
                            [
                                'id',
                                'user_profile_id ',
                                'user_profile_address_category_id', 
                                'created_by', 
                                'updated_by',
                                'created_at',
                                'updated_at',
                                'deleted_at'
                            ]);

                        if($update){
                            $profile->addresses()->updateOrCreate(['id' => $value['id'] ?? null], $value);
                        }
                    }
                    unset($value); // Разрыв ссылки на последний элемент
                    if(!$update){
                        $profile->addresses()->createMany($entityValue);
                    }
                    
                    break;
                case 'banks':

                    foreach ($entityValue as &$value) {
                        $value = $this->encryptExcept(
                            $value, 
                            [
                                'id',
                                'user_profile_id ',
                                'salutation ',
                                'user_profile_bank_categorie_id',
                                'created_by',
                                'updated_by',
                                'created_at',
                                'updated_at',
                                'deleted_at'
                            ]);
                        if($update){
                            $profile->banks()->updateOrCreate(['id' => $value['id'] ?? null], $value);
                        }
                    }
                    unset($value); // Разрыв ссылки на последний элемент
                    if(!$update){
                        $profile->banks()->createMany($entityValue);
                    }
                    
                    break;
                case 'contacts':


                    foreach ($entityValue as &$value) {
                        $value = $this->encryptExcept(
                            $value, 
                            [
                                'id',
                                'user_profile_id ',
                                'user_profile_contact_category_id', 
                                'user_profile_contact_type_id',
                                'created_by',
                                'updated_by',
                                'created_at',
                                'updated_at',
                                'deleted_at',
                            ]);
                        if($update){
                            $profile->contacts()->updateOrCreate(['id' => $value['id'] ?? null], $value);
                        }
                    }
                    unset($value); // Разрыв ссылки на последний элемент
                    if(!$update){
                        $profile->contacts()->createMany($entityValue);
                    }
                    
                    break;
            }
        }
    } 

    public function handleUsers($request, $profile, $users, $update = false){     
        foreach ($users as $key => &$user) {
            // Обработка загрузки аватара и получение его URL
            $avatarUrl = $this->handleAvatarUpload($request, $user, $key, $profile);
            if ($avatarUrl) {
                $user['avatar'] = $avatarUrl;
            }
    
            // Проверка, обновляем мы пользователя или создаём нового
            if ($update && isset($user['id'])) {
                // Обновляем пользователя
                $existingUser = $profile->users()->where('id', $user['id'])->first();
                if (!$existingUser) {
                    throw new \Exception("User not found.");
                }
    
                // Обновление пароля, если он предоставлен
                if (!empty($user['password'])) {
                    $user['password'] = Hash::make($user['password']);
                }
    
                $existingUser->update($user);
            } else {
                // Создание нового пользователя
                $user['password'] = Hash::make($user['password']); // Хеширование пароля
                $createdUser = $profile->users()->create($user);
    
                // После создания пользователя можно выполнить дополнительные действия,
                // например отправить уведомление или сохранить дополнительную информацию
                $this->sendEmailAuthDetails($profile, $createdUser, $user['password']);
            }
        }
        unset($user); // Разрыв ссылки для предотвращения неожиданного поведения
        
    }

    public function handleDocuments($request, $profile, $documents, $update = false){

        foreach ($documents as $key => &$document) {
            // Обработка загрузки аватара и получение его URL
            $documentPath = $this->handleDocumentUpload($request, $document, $key, $profile);
            if ($documentPath) {
                $document['path'] = $documentPath;
            }
    

            if ($update && isset($document['id'])) {

                $existingDocument = $profile->documents()->where('id', $document['id'])->first();
                if (!$existingDocument) {
                    throw new \Exception("User not found.");
                }   
    
                $existingDocument->update($document);
            } else {
                $profile->documents()->create($document);
            }
        }
        unset($document); // Разрыв ссылки для предотвращения неожиданного поведения
    }



    protected function handleAvatarUpload($request, array &$user, int $key, UserProfile $profile){
        if (!$request->hasFile("users.$key.avatar")) {
            return null;
        }

        $avatar = $request->file("users.$key.avatar");

        // Проверки валидности файла
        if (!$avatar->isValid()) {
            throw new \Exception("Invalid avatar file.");
        }

        // Проверка размера файла
        if ($avatar->getSize() > 5000000) { // примерный лимит в 5MB
            throw new \Exception("The avatar file is too large.");
        }

         // Проверка типа файла
        if (!in_array($avatar->getMimeType(), ['image/jpeg', 'image/png', 'image/gif'])) {
            throw new \Exception("Only JPEG, PNG, and GIF files are allowed.");
        }


        // Удаляем старый аватар, если он существует и это обновление пользователя
        if (!empty($user['id'])) {
            $existingUser = $profile->users()->where('id', $user['id'])->first();
            if ($existingUser && $existingUser->avatar) {
                $currentAvatarPath = parse_url($existingUser->avatar, PHP_URL_PATH);
                // Удаление начинается от публичного пути, поэтому удаляем '/storage'
                $currentAvatarPath = str_replace('/storage/', '', $currentAvatarPath);
                Storage::disk('public')->delete($currentAvatarPath);
            }
        }

        // Путь для загрузки
        $path = $avatar->store('avatars', 'public');
        $this->avatarPaths[] = $path;

        // Возвращаем URL к загруженному файлу
        return url(Storage::url($path));
    }

    protected function handleDocumentUpload($request, array &$d, int $key, UserProfile $profile){
        
        if (!$request->hasFile("documents.$key.file")) {
            return null;
        }

        $document = $request->file("documents.$key.file");

        if (!$document->isValid()) {
            throw new \Exception("Invalid Document file.");
        }

        // Проверка размера файла
        if ($document->getSize() > 5000000) { // примерный лимит в 5MB
            throw new \Exception("The Document file is too large.");
        }

         // Проверка типа файла
        if (!in_array($document->getMimeType(), ['image/jpeg', 'image/png', 'image/gif','application/pdf'])) {
            throw new \Exception("Only JPEG, PNG, GIF and PDF files are allowed.");
        }
       // dd($d);
        if (!empty($d['id'])) {
            $existingDocument = $profile->documents()->where('id', $d['id'])->first();
            if ($existingDocument) {

                // Удаление начинается от публичного пути, поэтому удаляем '/storage'
                $currentDokumentPath = str_replace('/storage/', '', $existingDocument->path);
                Storage::disk('local')->delete($currentDokumentPath);
            }
        }

        $path = $document->store('documents', 'local');
        $this->documentPaths[] = $path;
        dd($path);
        return $path;
        
    }

    // Метод для отправки письма с хешем верификации
    public function sendEmailVerificationHash($profile){
        Mail::to($profile->email)->queue(new VerifyEmail($profile));
        $profile->email_sent = now();
        $profile->email_verified_at = null;
        $profile->save();
    }

    public function sendEmailAuthDetails($profile, $user, $password){
        Mail::to($profile->email)->queue(new SendLoginDetails($user, $password));
        //$profile->email_sent = now();
        $profile->save();
    }

    public function cleanupUploadedFiles(){
        foreach ($this->avatarPaths as $path) {
            
            Storage::disk('public')->delete($path);
        }
        foreach ($this->documentPaths as $path) {
            
            Storage::disk('public')->delete($path);
        }
    }

}