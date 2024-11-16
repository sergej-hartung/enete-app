<?php

namespace App\Services;

use App\Models\Tariff\Tariff;
use App\Models\Tariff\TariffAttributeGroup;
use App\Models\Tariff\TariffAttribute;
use App\Models\Tariff\TariffCalcMatrix;
use App\Models\Tariff\TariffPromotion;
use App\Models\Tariff\TariffDetail;
use App\Models\Tariff\TariffTpl;
use Illuminate\Support\Facades\Auth;


class TariffService{

    public function createTariff($request, $data){

        $tariff_value = isset($data['tariff']) ? $data['tariff'] : null;
        $tariff = $this->handleTariff($tariff_value);

        if (!$tariff) {
            // Handle the error: tariff creation failed
            throw new \Exception('Tariff creation failed.');
        }
        
        $attributeGroups = isset($data['attribute_groups']) ? $data['attribute_groups'] : null;
        $this->handleTariffAttributeGroups($attributeGroups, $tariff);

        $calcMatrices = isset($data['calc_matrix']) ? $data['calc_matrix'] : null;
        $this->handleTariffCalcMatrices($calcMatrices, $tariff);

        $tariffPromos = isset($data['promos']) ? $data['promos'] : null;
        $this->handleTariffPromos($tariffPromos, $tariff);

        $tariffDetails = isset($data['tariffdetails']) ? $data['tariffdetails'] : null;
        $this->handleTariffDetails($tariffDetails, $tariff);

        $tpl = isset($data['tpl']) ? $data['tpl'] : null;
        $this->handleTariffTpl($tpl, $tariff);

        $categories = isset($data['categories']) ? $data['categories'] : null;
        $this->handleTariffCategories($categories, $tariff);

        $combo_status = isset($data['combo_status']) ? $data['combo_status'] : null;
        $this->handleTariffComboStatus($combo_status, $tariff);
    }

    public function handleTariff($entities, Tariff $tariff = null, bool $update = false){
        if($entities){
            if(isset($entities['file_name'])) unset($entities['file_name']);
            $value = $entities;

            if($update && $tariff){

            }else{
                $currentUserId = Auth::id();
                $value['created_by'] = $currentUserId;
                $tariff = Tariff::create($value);

                // Логирование создания тарифа
                activity()
                    ->performedOn($tariff)
                    ->causedBy($currentUserId)
                    ->withProperties(['tariff' => $tariff->toArray()]) // Логируем данные из созданной модели
                    ->log('Tarif erstellt');

                return $tariff;
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
                $attributeGroup->uniqueId = $groupData['uniqueId'];
                $attributeGroup->save();

                activity()
                    ->performedOn($tariff)
                    ->causedBy(Auth::id())
                    ->withProperties(['attribut_group' => $attributeGroup->toArray()])
                    ->log('Attributgruppe zum Tarif hinzugefügt');
    
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

                        activity()
                            ->performedOn($tariff)
                            ->causedBy(Auth::id())
                            ->withProperties(['attribute' => [
                                'tariff_id' => $tariff->id,
                                'attribute_id' => $tariffAttribute->id,
                                'value_varchar' => $attributeData['value_varchar'],
                                'value_text' => $attributeData['value_text'],
                                'is_active' => $attributeData['is_active'],
                                'created_by' => auth()->id(),
                                'updated_by' => auth()->id()
                            ]])
                            ->log('Attribut zum Tarif hinzugefügt');
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

                activity()
                    ->performedOn($tariff)
                    ->causedBy(Auth::id())
                    ->withProperties(['calc_matrix' => $calcMatrix->toArray()])
                    ->log('Kalkulationsmatrix hinzugefügt');

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

                        activity()
                            ->performedOn($tariff)
                            ->causedBy(Auth::id())
                            ->withProperties(['calc_matrix_attribute' => [
                                'calc_matrix_id ' => $calcMatrix->id,
                                'attribute_id' => $tariffAttribute->id,
                                'period' => $attributeData['period'],
                                'periodeTyp' => $attributeData['periodeTyp'],
                                'single' => $attributeData['single'],
                                'unit' => $attributeData['unit'],
                                'value' => $attributeData['value'],
                                'value_total' => $attributeData['value_total'],
                                'position' => $position
                            ]])
                            ->log('Attribut zur Kalkulationsmatrix hinzugefügt');
                    }
                }
            }
        }
    }

    public function handleTariffPromos($entities, Tariff $tariff){
        if($entities){
            foreach($entities as $promoData){
                $promo = new TariffPromotion();
                $promo->tariff_id = $tariff->id;
                $promo->start_date = $promoData['start_date'];
                $promo->end_date = $promoData['end_date'];
                $promo->text_long = $promoData['text_long'];
                $promo->title = $promoData['title'];
                $promo->is_active = $promoData['is_active'];
                $promo->save();

                activity()
                    ->performedOn($tariff)
                    ->causedBy(Auth::id())
                    ->withProperties(['promo' => $promo->toArray()])
                    ->log('Promoaktion hinzugefügt');
            }
        }
    }

    public function handleTariffDetails($entities, Tariff $tariff){
        if($entities){
            foreach($entities as $index => $tariffDetailData){
                $attributeGroup = TariffAttributeGroup::where('uniqueId', $tariffDetailData['uniqueId'])->first();
                if($attributeGroup){
                    $position = $index + 1;

                    $tariffDetail  = new TariffDetail();
                    $tariffDetail->tariff_id = $tariff->id;
                    $tariffDetail->tariff_attribute_group_id = $attributeGroup->id;
                    $tariffDetail->position = $position;
                    $tariffDetail->save();

                    activity()
                        ->performedOn($tariff)
                        ->causedBy(Auth::id())
                        ->withProperties(['detail' => $tariffDetail->toArray()])
                        ->log('Tarifdetail hinzugefügt');
                }
            }
        }
    }

    public function handleTariffTpl($entities, Tariff $tariff){
        if($entities){
            
            foreach($entities as $tplData){
                // var_dump($entities);
                $matrixId = null;
                if (isset($tplData['matrix']) && !empty($tplData['matrix']['uniqueId'])) {
                    // Проверяем наличие TariffCalcMatrix по указанному uniqueId
                    $matrix = TariffCalcMatrix::where('uniqueId', $tplData['matrix']['uniqueId'])->first();
                    if ($matrix) {
                        $matrixId = $matrix->id;
                    }
                }

                $attributeId = null;
                if (isset($tplData['attribute']) && !empty($tplData['attribute']['id'])) {
                    // Проверяем наличие TariffAttribute по указанному ID
                    $attribute = TariffAttribute::find($tplData['attribute']['id']);
                    if ($attribute) {
                        $attributeId = $attribute->id;
                    }
                }
    
                    // Получаем текущего пользователя
                $currentUserId = Auth::id();

                $tariffTpl  = new TariffTpl();
                $tariffTpl->tariff_id = $tariff->id;
                $tariffTpl->matrix_id = $matrixId;
                $tariffTpl->attribute_id = $attributeId;
                $tariffTpl->auto_field_name = $tplData['autoFieldName'] ?? false;
                $tariffTpl->auto_unit = $tplData['autoUnit'] ?? false;
                $tariffTpl->auto_value_source = $tplData['autoValueSource'] ?? false;
                $tariffTpl->custom_field = $tplData['customFild'] ?? false;
                $tariffTpl->icon = $tplData['icon'] ?? null;
                $tariffTpl->is_matrix = $tplData['isMatrix'] ?? false;
                $tariffTpl->manual_field_name = $tplData['manualFieldName'] ?? null;
                $tariffTpl->manual_unit = $tplData['manualUnit'] ?? null;
                $tariffTpl->manual_value = $tplData['manualValue'] ?? null;
                $tariffTpl->position = $tplData['position'] ?? 0;
                $tariffTpl->show_field_name = $tplData['showFieldName'] ?? false;
                $tariffTpl->show_icon = $tplData['showIcon'] ?? false;
                $tariffTpl->show_unit = $tplData['showUnit'] ?? false;
                $tariffTpl->show_value = $tplData['showValue'] ?? false;
                $tariffTpl->created_by = $currentUserId;
                $tariffTpl->save();

                activity()
                    ->performedOn($tariff)
                    ->causedBy($currentUserId)
                    ->withProperties(['tpl' => $tariffTpl->toArray()])
                    ->log('Tarifvorlage hinzugefügt');
            }
        }
        
    }

    public function handleTariffCategories($entities, Tariff $tariff){
        if($entities){
            $checkedCategories = array_filter($entities, function ($category) {
                return $category['checked'];
            });

            $categoryIds = array_map(function ($category) {
                return $category['id'];
            }, $checkedCategories);

            $tariff->category()->sync($categoryIds);

            foreach($checkedCategories as $checkedCategorie){
                activity()
                    ->performedOn($tariff)
                    ->causedBy(Auth::id())
                    ->withProperties(['categorie' => [
                        'category_id' => $checkedCategorie['id'],
                        'tariff_id' => $tariff->id
                    ]])
                    ->log('Kategorien zum Tarif hinzugefügt');
            }
        }
    }

    public function handleTariffComboStatus($entities, Tariff $tariff){
        if($entities){
            $checkedComboStatuses = array_filter($entities, function ($comboStatus) {
                return $comboStatus['checked'];
            });

            $comboStatusIds = array_map(function ($comboStatus) {
                return $comboStatus['id'];
            }, $checkedComboStatuses);

            $tariff->comboStatus()->sync($comboStatusIds);

            foreach($checkedComboStatuses as $checkedComboStatus){
                activity()
                    ->performedOn($tariff)
                    ->causedBy(Auth::id())
                    ->withProperties(['combo_status' => [
                        'combo_status_id' => $checkedComboStatus['id'],
                        'tariff_id' => $tariff->id
                    ]])
                    ->log('Kombinationstatus zum Tarif hinzugefügt');
            }

        }
    }

}