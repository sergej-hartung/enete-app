<?php

namespace App\Traits;

use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;

trait HandlesUserProfile
{
    public function encryptExcept(array $data, array $except)
    {
        return collect($data)->mapWithKeys(function ($value, $key) use ($except) {
            return in_array($key, $except) ? [$key => $value] : [$key => Crypt::encryptString($value)];
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
                if (!empty($value) && str_starts_with($value, 'eyJpdiI6')) { // Проверка на пустое значение перед расшифровкой
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
    
}