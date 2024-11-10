<?php

namespace App\Services;

use App\Models\Tariff\Tariff;
use App\Models\Tariff\TariffAttributeGroup;
use App\Models\Tariff\TariffAttribute;
use App\Models\Tariff\TariffCalcMatrix;


class TariffService{

    public function createTariff($request, $data){
        //var_dump($data);
        // $data['user_type'] = 'is_employee';
        // $extractedData = $this->extractData($data);
        $tariff_value = isset($data['tariff']) ? $data['tariff'] : null;
        $tariff = $this->handleTariff($tariff_value);
        
        $attributeGroups = isset($data['attribute_groups']) ? $data['attribute_groups'] : null;
        $this->handleTariffAttributeGroups($attributeGroups, $tariff);

        $calcMatrices = isset($data['calc_matrix']) ? $data['calc_matrix'] : null;
        $this->handleTariffCalcMatrices($calcMatrices, $tariff);

        // $profile = $this->handleUserProfiles($extractedData);           
        // $this->handleRelatedEntities($profile, $extractedData);   
        // $this->sendEmailVerificationHash($profile);         
        // $this->handleUsers($request, $profile, $extractedData['users'] ?? []);
        // $this->handleDocuments($request, $profile, $extractedData['documents'] ?? []);
    }

    public function handleTariff($entities, Tariff $tariff = null, bool $update = false){
        if($entities){
            if(isset($entities['file_name'])) unset($entities['file_name']);

            $value = $entities;

            if($update && $tariff){

            }else{
                return Tariff::create($value);
            }
        }
    }

    public function handleTariffAttributeGroups($entities, Tariff $tariff){
        if($entities){
            foreach($entities as $groupData){
                // Создание или обновление группы атрибутов
                $attributeGroup = new TariffAttributeGroup();
                $attributeGroup->tariff_id = $tariff->id;
                $attributeGroup->name = $groupData['name'];
                $attributeGroup->save();
    
                // Проход по каждому атрибуту внутри группы
                foreach ($groupData['attributs'] as $index => $attributeData){
                    $attributeId = $attributeData['id'];
                    $tariffAttribute = TariffAttribute::find($attributeId);
    
                    if ($tariffAttribute) {
                        // Определяем позицию как индекс в массиве + 1
                        $position = $index + 1;
    
                        // Привязываем атрибут к группе через pivot таблицу tariff_attribute_group_mappings
                        $attributeGroup->attributes()->attach(
                            $tariffAttribute->id,
                            [
                                'position' => $position
                            ]
                        );
    
                        // Привязываем атрибут к тарифу через pivot таблицу tariff_attribute_mappings
                        $tariff->attributes()->attach(
                            $tariffAttribute->id,
                            [
                                'value_varchar' => $attributeData['value_varchar'],
                                'value_text' => $attributeData['value_text'],
                                'is_active' => $attributeData['is_active'],
                                'created_by' => auth()->id(),
                                'updated_by' => auth()->id()
                            ]
                        );
                    }
                }
            }
        }
        
    }

    public function handleTariffCalcMatrices($entities, Tariff $tariff){
        if($entities){
            foreach($entities as $matrixData){
                // Создание новой записи калькуляционной матрицы
                $calcMatrix = new TariffCalcMatrix();
                $calcMatrix->tariff_id = $tariff->id;
                $calcMatrix->name = $matrixData['name'];
                $calcMatrix->total_value = $matrixData['total_value'];
                $calcMatrix->unit = $matrixData['unit'];
                $calcMatrix->uniqueId = $matrixData['uniqueId'];
                $calcMatrix->save();

                // Привязка атрибутов к калькуляционной матрице через pivot таблицу calc_matrix_attribute_mappings
                foreach ($matrixData['attributs'] as $index => $attributeData) {
                    $attributeId = $attributeData['id'];
                    $tariffAttribute = TariffAttribute::find($attributeId);

                    if ($tariffAttribute) {
                        // Привязываем атрибут к калькуляционной матрице
                        $position = $index + 1;
                        $calcMatrix->attributs()->attach(
                            $tariffAttribute->id,
                            [
                                'period' => $attributeData['period'],
                                'periodeTyp' => $attributeData['periodeTyp'],
                                'single' => $attributeData['single'],
                                'unit' => $attributeData['unit'],
                                'value' => $attributeData['value'],
                                'value_total' => $attributeData['value_total'],
                                'position' => $position
                            ]
                        );
                    }
                }
            }
        }
    }

    // public function handleUserProfiles($entities, UserProfile $profile = null, bool $update = false){

    //     $value = $entities['user_profile'];

    //     if($update && $profile){
    //         if(isset($value['email'])){
    //             $value['email_verification_hash'] = hash('sha256', Str::random(40));
    //             $this->sendEmailVerificationHash($profile);
    //         }
    //         $profile->update($value);
    //     }else{
    //         $value['email_verification_hash'] = hash('sha256', Str::random(40));

    //         return UserProfile::create($value);
    //     }
        
    // }
}