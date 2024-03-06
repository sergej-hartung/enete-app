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

class UserProfileService{

    public $avatarPaths = [];


    public function extractData(&$data)
    {
        return [
            'employee_details' => Arr::pull($data, 'employee_details', false),
            'addresses' => Arr::pull($data, 'addresses', false),
            'banks' => Arr::pull($data, 'banks', false),
            'contacts' => Arr::pull($data, 'contacts', false),
            'users' => Arr::pull($data, 'users', false),
            'user_profile' => $data
        ];
    }

    public function handleUserProfiles($entities){
        $value = $this->encryptExcept(
            $entities['user_profile'], 
            [
                'salutation', 
                'title', 
                'birthdate',              
                'email', 
                'email_sent',
                'email_verification_hash',
                'internal_note', 
                'external_note', 
                'parent_id', 
                'user_type',
                'created_by',
                'updated_by'
            ]);

        $value['email_verification_hash'] = hash('sha256', Str::random(40));

        return UserProfile::create($value);
    }

    public function handleRelatedEntities($profile, $entities)
    {
        foreach ($entities as $entityKey => $entityValue) {
            if (!$entityValue || !is_array($entityValue)) {
                continue;
            }

            // Определение типа связанных данных и их обработка
            switch ($entityKey) {

                case 'employee_details':
                    
                    $profile->employee()->create($entityValue);
                    break;
                case 'addresses':

                    foreach ($entityValue as &$value) {
                        $value = $this->encryptExcept(
                            $value, 
                            [
                                'id ',
                                'user_profile_id ',
                                'user_profile_address_category_id', 
                                'created_by', 
                                'updated_by',
                                'created_at',
                                'updated_at',
                                'deleted_at'
                            ]);
                    }
                    unset($value); // Разрыв ссылки на последний элемент
                    $profile->addresses()->createMany($entityValue);
                    break;
                case 'banks':

                    foreach ($entityValue as &$value) {
                        $value = $this->encryptExcept(
                            $value, 
                            [
                                'id ',
                                'user_profile_id ',
                                'salutation ',
                                'user_profile_bank_categorie_id',
                                'created_by',
                                'updated_by',
                                'created_at',
                                'updated_at',
                                'deleted_at'
                            ]);
                    }
                    unset($value); // Разрыв ссылки на последний элемент
                    $profile->banks()->createMany($entityValue);
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
                    }
                    unset($value); // Разрыв ссылки на последний элемент
                    $profile->contacts()->createMany($entityValue);
                    break;
            }
        }
    }

    public function encryptExcept(array $data, array $except){
        return collect($data)->mapWithKeys(function ($value, $key) use ($except) {
            // Пропускаем шифрование для исключённых ключей
            if (in_array($key, $except)) {
                return [$key => $value];
            }

            // Шифруем значение, если ключ не исключён
            return [$key => Crypt::encryptString($value)];
        })->all();
    }

    /**
 * Расшифровывает указанные поля для модели и её связанных данных.
 *
 * @param \Illuminate\Database\Eloquent\Model $entity Модель для расшифровки
 * @param array $fields Список полей для расшифровки
 * @param array $relations Ассоциативный массив связей и полей для расшифровки
 * @param bool $excludeFields Указывает, применять ли список полей как исключения
 */
public function decryptFields($entity, array $fields, array $relations = [], bool $excludeFields = false)
{
    // Расшифровка основных полей модели
    foreach ($entity->getAttributes() as $field => $value) {
        if (($excludeFields && !in_array($field, $fields)) || (!$excludeFields && in_array($field, $fields))) {
            if (!empty($value)) { // Проверка на пустое значение перед расшифровкой
                $entity->$field = Crypt::decryptString($value);
            }
        }
    }

    // Обработка связанных данных
    foreach ($relations as $relation => $relFields) {
        if ($entity->relationLoaded($relation)) {
            $relatedData = $entity->$relation;

            // Обработка как коллекции, так и одиночных моделей
            if ($relatedData instanceof \Illuminate\Database\Eloquent\Collection) {
                foreach ($relatedData as $relatedItem) {
                    $this->decryptFields($relatedItem, $relFields, [], $excludeFields);
                }
            } elseif($relatedData instanceof \Illuminate\Database\Eloquent\Model) {
                $this->decryptFields($relatedData, $relFields, [], $excludeFields);
            }
        }
    }
}

    public function handleUsers($request, $profile, $users)
    {        
        foreach ($users as $key => $user) {
            if ($request->hasFile("users.$key.avatar")) {
                $avatar = $request->file("users.$key.avatar");
                $path = $this->uploadAvatar($avatar);
                $user['avatar'] = url(Storage::url($path));
                $this->avatarPaths[] = $path;
            }

            $user['password'] = Hash::make($user['password']);
            $createdUser = $profile->users()->create($user);

            $this->sendEmailAuthDetails($profile, $createdUser, $user['password']);
        }
    }

    public function uploadAvatar($avatar)
    {
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

        // Загрузка файла
        return $avatar->store('avatars', 'public');
    }

    // Метод для отправки письма с хешем верификации
    public function sendEmailVerificationHash($profile)
    {
        Mail::to($profile->email)->queue(new VerifyEmail($profile));
        $profile->email_sent = now();
        $profile->save();
    }

    public function sendEmailAuthDetails($profile, $user, $password)
    {
        Mail::to($profile->email)->queue(new SendLoginDetails($user, $password));
        $profile->email_sent = now();
        $profile->save();
    }

    public function cleanupUploadedFiles()
    {
        foreach ($this->avatarPaths as $path) {
            
            Storage::disk('public')->delete($path);
        }
    }

}