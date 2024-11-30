<?php

namespace App\Services;

use App\Models\Tariff\Tariff;
use App\Models\Tariff\TariffAttributeGroup;
use App\Models\Tariff\TariffAttribute;
use App\Models\Tariff\TariffCalcMatrix;
use App\Models\Tariff\TariffPromotion;
use App\Models\Tariff\TariffDetail;
use App\Models\Tariff\TariffTpl;
use Hamcrest\Arrays\IsArray;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class TariffService{

    public function updateTariff($request, $data, $id){
        //var_dump($data);
        $tariff = Tariff::findOrFail($id);
        if(!$tariff){
            throw new \Exception('Tariff not found.');
        }

        $update = false;
        foreach($data["updated"] as $dataUpdate){
            //var_dump($data['tariff']);
            

            if(isset($dataUpdate['tariff'])){
                $this->handleTariff($dataUpdate['tariff'], $tariff, true);  // geprüft
            }

            if(isset($dataUpdate['attribute_groups'])){
                $update = true;
                $this->handleTariffAttributeGroups($dataUpdate['attribute_groups'], $tariff, true);  // geprüft
            }
            if(isset($dataUpdate['calc_matrix'])){
                $update = true;
                $this->handleTariffCalcMatrices($dataUpdate['calc_matrix'], $tariff, true);  // geprüft
            }
            if(isset($dataUpdate['promos'])){
                $update = true;
                $this->handleTariffPromos($dataUpdate['promos'], $tariff, true);  // geprüft
            }
            if(isset($dataUpdate['tariffdetails'])){
                $update = true;
                $this->handleTariffDetails($dataUpdate['tariffdetails'], $tariff, true); // geprüft
            }
            if(isset($dataUpdate['tpl'])){
                $update = true;
                $this->handleTariffTpl($dataUpdate['tpl'], $tariff, true);  // geprüft
            }
            if(isset($dataUpdate['categories'])){
                $update = true;
                $this->handleTariffCategories($dataUpdate['categories'], $tariff, true); // geprüft
            }
            if(isset($dataUpdate['combo_status'])){
                $update = true;
                $this->handleTariffComboStatus($dataUpdate['combo_status'], $tariff, true);
            }
        }
        
        foreach($data["added"] as $dataAdded){
            if(isset($dataAdded['attribute_groups'])){
                $update = true;
                $this->handleTariffAttributeGroups($dataAdded['attribute_groups'], $tariff);  // geprüft
            }
            if(isset($dataAdded['calc_matrix'])){
                $update = true;
                $this->handleTariffCalcMatrices($dataAdded['calc_matrix'], $tariff);  // geprüft
            }
            if(isset($dataAdded['promos'])){
                $update = true;
                $this->handleTariffPromos($dataAdded['promos'], $tariff);  // geprüft
            }
            if(isset($dataAdded['tariffdetails'])){
                $update = true;
                $this->handleTariffDetails($dataAdded['tariffdetails'], $tariff); // geprüft
            }
            if(isset($dataAdded['tpl'])){
                $update = true;
                $this->handleTariffTpl($dataAdded['tpl'], $tariff, true);  // geprüft
            }
        }
        
        if(isset($data["deleted"])){
            foreach($data["deleted"] as $dataDeleted){
                $update = true;
                $this->handleDeleted($dataDeleted, $tariff);
            }
        }
        
        $tariff->touch();


        return Tariff::with(
            'comboStatus',
            'category',
            'provider', 
            'networkOperator', 
            'group', 
            'status',
            'document',
            'clacMatrices',
            'clacMatrices.attributs',
            'attributeGroups', 
            'attributeGroups.attributes', 
            'attributeGroups.attributes.inputType',
            'attributeGroups.attributes.tariffAttributes',
            'promotions',
            'tariffTpls',
            'tariffTpls.matrix',
            'tariffTpls.attribute',
            'tariffTpls.attribute.tariffAttributes',
            'tariffDetails',
            'tariffDetails.attributeGroup',
            'tariffDetails.attributeGroup.attributes'
        )->find($id);
    }

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
            if(isset($entities['file_name'])){
                unset($entities['file_name']);
            } 

            
            if($update && $tariff){                
                $currentUserId = Auth::id();            
                foreach($entities as $tariffData){
                    $value = $tariffData;
                    $value['updated_by'] = $currentUserId;
                    $tariff->update($value);

                    activity()
                        ->performedOn($tariff)
                        ->causedBy($currentUserId)
                        ->withProperties(['tariff' => $value])
                        ->log('Tarif aktualisiert');
                }
            }else{
                $value = $entities;
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

    public function handleTariffAttributeGroups($entities, Tariff $tariff, bool $update = false){
        if($entities){
            $currentUserId = Auth::id();
            foreach($entities as $groupData){
                $groupId = $groupData['id'] ?? null;
                if($update && $groupId){
                    $tariffAttributeGroupId = false;
                    $attributs = false;

                    if(isset($groupData['id'])){
                        $tariffAttributeGroupId = $groupData['id'];
                        unset($groupData['id']);
                    }
                    if(isset($groupData['attributs'])){
                        $attributs = $groupData['attributs'];
                        unset($groupData['attributs']);
                    }

                    
                    if($groupData && is_array($groupData) && count($groupData) > 0 && $tariffAttributeGroupId){
                        $attributeGroup = TariffAttributeGroup::find($tariffAttributeGroupId);
                        if($attributeGroup){
                            $value = $groupData;
                            $value['updated_by'] = $currentUserId;
                            $attributeGroup->update($groupData);

                            activity()
                                ->performedOn($tariff)
                                ->causedBy($currentUserId)
                                ->withProperties(['attribute_group' => $groupData])
                                ->log('Attributgruppe aktualisiert');
                        }
                    }

                    if($attributs && is_array($attributs) && count($attributs) > 0 && $tariffAttributeGroupId){
                        $attributeGroup = TariffAttributeGroup::find($tariffAttributeGroupId);
                        
                        foreach($attributs as $atribute){
                            $value = $atribute;
                            $attributeId = $value['id'];
                            
                            if($attributeId && $attributeGroup){
                                $tariffAttribute = TariffAttribute::find($attributeId);
                                
                                if($tariffAttribute && isset($value['position'])){
                                    $attributeGroup->attributes()->updateExistingPivot($attributeId, [
                                        'position' => $value['position'],
                                        'updated_by' => $currentUserId
                                    ]);

                                    unset($value['id']);
                                    unset($value['position']);
                                }
                            }

                            if($tariff && $attributeId && $value && is_array($value) && count($value) > 0){
                                if(isset($value['id'])){
                                    unset($value['id']);
                                }
                                $value['updated_by'] = $currentUserId;
                                $tariff->attributes()->updateExistingPivot(
                                    $attributeId, $value
                                );
                            }

                            activity()
                                ->performedOn($tariff)
                                ->causedBy(Auth::id())
                                ->withProperties(['attribute' => $atribute])
                                ->log('Attribut zum Tarif aktualisiert');

                        }
                    }
                    
                }else{
                    // Создание или обновление группы атрибутов
                    $attributeGroup = false;
                    if(count($groupData) > 2){
                        $attributeGroup = new TariffAttributeGroup();
                        $attributeGroup->tariff_id = $tariff->id;
                        $attributeGroup->name = $groupData['name'];
                        $attributeGroup->uniqueId = $groupData['uniqueId'];
                        $attributeGroup->created_by = $currentUserId;
                        $attributeGroup->save();

                        activity()
                        ->performedOn($tariff)
                        ->causedBy(Auth::id())
                        ->withProperties(['attribut_group' => $attributeGroup->toArray()])
                        ->log('Attributgruppe zum Tarif hinzugefügt');
                    }
                    
                    if(!$attributeGroup && isset($groupData['id'])){
                        $attributeGroup = TariffAttributeGroup::findOrFail($groupData['id']);
                    }

                    
                    if($attributeGroup){
                        // Проход по каждому атрибуту внутри группы
                        foreach ($groupData['attributs'] as $index => $attributeData){
                            
                            $attributeId = $attributeData['id'];
                            $tariffAttribute = TariffAttribute::findOrFail($attributeId);
            
                            if ($tariffAttribute) {
                                // Определяем позицию как индекс в массиве + 1
                                $position = $index + 1;
            
                                // Привязываем атрибут к группе через pivot таблицу tariff_attribute_group_mappings
                                $attributeGroup->attributes()->attach(
                                    $tariffAttribute->id,
                                    [
                                        'position' => $position,
                                        'created_by' => $currentUserId
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
        }
        
    }

    public function handleTariffCalcMatrices($entities, Tariff $tariff, bool $update = false){
        $currentUserId = Auth::id();
        if($entities){
            foreach($entities as $matrixData){
                $matrixId  = $matrixData['id'] ?? null;                

                if($update && $matrixId){
                    $value = $matrixData;
                    unset($value['id']);

                    $attributs = false;

                    if(isset($value['attributs'])){
                        $attributs = $value['attributs'];
                        unset($value['attributs']);
                    }

                    if($value && is_array($value) && count($value) > 0){
                        $calcMatrix = TariffCalcMatrix::findOrFail($matrixId);
                        if($calcMatrix){
                            $value['updated_by'] = $currentUserId;
                            $calcMatrix->update($value);

                            activity()
                            ->performedOn($tariff)
                            ->causedBy(Auth::id())
                            ->withProperties(['calc_matrix' => $value])
                            ->log('Kalkulationsmatrix aktualisiert');
                        }
                    }

                    if($matrixId && $attributs && is_array($attributs) && count($attributs) > 0){
                        $calcMatrix = TariffCalcMatrix::findOrFail($matrixId);
                        if($calcMatrix){
                            foreach($attributs as $attribute){
                                if(isset($attribute['id'])){
                                    $value = $attribute;
                                    $value['updated_by'] = $currentUserId;
                                    unset($value['id']);
                                    $calcMatrix->attributs()->updateExistingPivot(
                                        ['attribute_id' => $attribute['id']],
                                        $value
                                    );
                                }
                            }
                        }                        
                    }

                }else{
                    $calcMatrix = false;
                    if(count($matrixData) > 2){
                        // Создание новой записи калькуляционной матрицы
                        $calcMatrix = new TariffCalcMatrix();
                        $calcMatrix->tariff_id = $tariff->id;
                        $calcMatrix->name = $matrixData['name'];
                        $calcMatrix->total_value = $matrixData['total_value'];
                        $calcMatrix->unit = $matrixData['unit'];
                        $calcMatrix->uniqueId = $matrixData['uniqueId'];
                        $calcMatrix->created_by = $currentUserId;
                        $calcMatrix->save();

                        activity()
                            ->performedOn($tariff)
                            ->causedBy(Auth::id())
                            ->withProperties(['calc_matrix' => $calcMatrix->toArray()])
                            ->log('Kalkulationsmatrix hinzugefügt');

                    }

                    if(!$calcMatrix && isset($matrixData['id'])){
                        $calcMatrix = TariffCalcMatrix::findOrFail($matrixData['id']);
                    }

                    if($calcMatrix){
                        // Привязка атрибутов к калькуляционной матрице через pivot таблицу calc_matrix_attribute_mappings
                        foreach ($matrixData['attributs'] as $index => $attributeData) {
                            $attributeId = $attributeData['id'];
                            $tariffAttribute = TariffAttribute::find($attributeId);

                            if ($tariffAttribute) {
                                // Привязываем атрибут к калькуляционной матрице
                                $position = $index + 1;
                                $value = str_replace(',', '.', $attributeData['value']);
                                $floatValue = (float) $value;
                                $calcMatrix->attributs()->attach(
                                    $tariffAttribute->id,
                                    [
                                        'period' => $attributeData['period'],
                                        'periodeTyp' => $attributeData['periodeTyp'],
                                        'single' => $attributeData['single'],
                                        'unit' => $attributeData['unit'],
                                        'value' => $floatValue,
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
        }
    }

    public function handleTariffPromos($entities, Tariff $tariff, bool $update = false){
        if($entities){
            $currentUserId = Auth::id();
            foreach($entities as $promoData){
                $promoId  = $promoData['id'] ?? null;   
                if($update && $promoId){
                    $promo = TariffPromotion::findOrFail($promoId);
                    if($promo){
                        $value = $promoData;
                        $value['updated_by'] = $currentUserId;
                        $promo->update($value);

                        activity()
                            ->performedOn($tariff)
                            ->causedBy(Auth::id())
                            ->withProperties(['promo' => $value])
                            ->log('Promoaktion aktualisiert');
                    }
                }else{
                    $promo = new TariffPromotion();
                    $promo->tariff_id = $tariff->id;
                    $promo->start_date = $promoData['start_date'];
                    $promo->end_date = $promoData['end_date'];
                    $promo->text_long = $promoData['text_long'];
                    $promo->title = $promoData['title'];
                    $promo->is_active = $promoData['is_active'];
                    $promo->created_by = $currentUserId;
                    $promo->save();

                    activity()
                        ->performedOn($tariff)
                        ->causedBy(Auth::id())
                        ->withProperties(['promo' => $promo->toArray()])
                        ->log('Promoaktion hinzugefügt');
                    }
                
            }
        }
    }

    public function handleTariffDetails($entities, Tariff $tariff, bool $update = false){
        if($entities){
            $currentUserId = Auth::id();
            foreach($entities as $index => $tariffDetailData){
                $tariffDetailId  = $tariffDetailData['id'] ?? null; 
                if($update && $tariffDetailId && $tariff){
                    
                    $tariffDetail = TariffDetail::findOrFail($tariffDetailId);
                    if($tariffDetail){
                        $value = [];
                        $value['tariff_id'] = $tariff->id;
                        $value['updated_by'] = $currentUserId;

                        if(isset($tariffDetailData['tariffAttributeGroupId'])){
                            $value['tariff_attribute_group_id'] = $tariffDetailData['tariffAttributeGroupId'];
                        } 
                        if(isset($tariffDetailData['position'])){
                            $value['position'] = $tariffDetailData['position'];
                        } 

                        $tariffDetail->update($value);

                        activity()
                            ->performedOn($tariff)
                            ->causedBy(Auth::id())
                            ->withProperties(['detail' => $value])
                            ->log('Tarifdetail aktualisiert');
                    }
                }else if(isset($tariffDetailData['uniqueId'])){
                    $attributeGroup = TariffAttributeGroup::where('uniqueId', $tariffDetailData['uniqueId'])->first();
                    if($attributeGroup){
                        $position = isset($tariffDetailData['position']) ? $tariffDetailData['position'] : $index + 1;

                        $tariffDetail  = new TariffDetail();
                        $tariffDetail->tariff_id = $tariff->id;
                        $tariffDetail->tariff_attribute_group_id = $attributeGroup->id;
                        $tariffDetail->position = $position;
                        $tariffDetail->created_by = $currentUserId;
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
    }

    public function handleTariffTpl($entities, Tariff $tariff, bool $update = false){
        if($entities){
            
            $currentUserId = Auth::id();
            foreach($entities as $tplData){
                $tplId  = $tplData['id'] ?? null;
                if($update && $tplId){
                    $value = [];
                    $value['updated_by'] = $currentUserId;

                    if(isset($tplData['matrix']) && is_array($tplData['matrix'])){
                        foreach($tplData['matrix'] as $matrix){
                            if(isset($matrix['id'])){
                                $value['matrix_id'] = $matrix['id'];
                            }else if (isset($matrix['uniqueId']) && !empty($matrix['uniqueId'])) {
                                // Проверяем наличие TariffCalcMatrix по указанному uniqueId
                                $matrixObj = TariffCalcMatrix::where('uniqueId', $matrix['uniqueId'])->first();
                                if ($matrixObj) {
                                    $value['matrix_id'] = $matrixObj->id;
                                }
                            }
                            
                        }
                    }

                    if(isset($tplData['attribute']) && is_array($tplData['attribute'])){
                        foreach($tplData['attribute'] as $attribute){
                            if(isset($attribute['id'])){
                                $value['attribute_id'] = $attribute['id'];
                            }
                        }
                    }
                    
                    if(isset($tplData['autoFieldName'])){
                        $value['auto_field_name'] = $tplData['autoFieldName'];
                    }
                    if(isset($tplData['autoUnit'])){
                        $value['auto_unit'] = $tplData['autoUnit'];
                    }
                    if(isset($tplData['autoValueSource'])){
                        $value['auto_value_source'] = $tplData['autoValueSource'];
                    }
                    if(isset($tplData['customFild'])){
                        $value['custom_field'] = $tplData['customFild'];
                    }
                    if(isset($tplData['icon'])){
                        $value['icon'] = $tplData['icon'];
                    }
                    if(isset($tplData['isMatrix'])){
                        $value['is_matrix'] = $tplData['isMatrix'];
                    }
                    if(isset($tplData['isHtml'])){
                        $value['is_html'] = $tplData['isHtml'];
                    }
                    if(isset($tplData['manualFieldName'])){
                        $value['manual_field_name'] = $tplData['manualFieldName'];
                    }
                    if(isset($tplData['manualUnit'])){
                        $value['manual_unit'] = $tplData['manualUnit'];
                    }
                    if(isset($tplData['manualValue'])){
                        $value['manual_value'] = $tplData['manualValue'];
                    }
                    if(isset($tplData['manualValueHtml'])){
                        $value['manual_value_html'] = $tplData['manualValueHtml'];
                    }
                    if(isset($tplData['position'])){
                        $value['position'] = $tplData['position'];
                    }
                    if(isset($tplData['showFieldName'])){
                        $value['show_field_name'] = $tplData['showFieldName'];
                    }
                    if(isset($tplData['showIcon'])){
                        $value['show_icon'] = $tplData['showIcon'];
                    }
                    if(isset($tplData['showUnit'])){
                        $value['show_unit'] = $tplData['showUnit'];
                    }
                    if(isset($tplData['showValue'])){
                        $value['show_value'] = $tplData['showValue'];
                    }
                    $tariffTpl = TariffTpl::findOrFail($tplId);
                    if($tariffTpl){
                        $tariffTpl->update($value);
                    }

                    activity()
                        ->performedOn($tariff)
                        ->causedBy($currentUserId)
                        ->withProperties(['tpl' => $value])
                        ->log('Tarifvorlage aktualisiert');


                }else{
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
        

                    $tariffTpl                    = new TariffTpl();
                    $tariffTpl->tariff_id         = $tariff->id;
                    $tariffTpl->matrix_id         = $matrixId;
                    $tariffTpl->attribute_id      = $attributeId;
                    $tariffTpl->auto_field_name   = $tplData['autoFieldName'] ?? false;
                    $tariffTpl->auto_unit         = $tplData['autoUnit'] ?? false;
                    $tariffTpl->auto_value_source = $tplData['autoValueSource'] ?? false;
                    $tariffTpl->custom_field      = $tplData['customFild'] ?? false;
                    $tariffTpl->icon              = $tplData['icon'] ?? null;
                    $tariffTpl->is_matrix         = $tplData['isMatrix'] ?? false;
                    $tariffTpl->is_html           = $tplData['isHtml'] ?? false;
                    $tariffTpl->manual_field_name = $tplData['manualFieldName'] ?? null;
                    $tariffTpl->manual_unit       = $tplData['manualUnit'] ?? null;
                    $tariffTpl->manual_value      = $tplData['manualValue'] ?? null;
                    $tariffTpl->manual_value_html = $tplData['manualValueHtml'] ?? null;
                    $tariffTpl->position          = $tplData['position'] ?? 0;
                    $tariffTpl->show_field_name   = $tplData['showFieldName'] ?? false;
                    $tariffTpl->show_icon         = $tplData['showIcon'] ?? false;
                    $tariffTpl->show_unit         = $tplData['showUnit'] ?? false;
                    $tariffTpl->show_value        = $tplData['showValue'] ?? false;
                    $tariffTpl->created_by        = $currentUserId;
                    $tariffTpl->save();

                    activity()
                        ->performedOn($tariff)
                        ->causedBy($currentUserId)
                        ->withProperties(['tpl' => $tariffTpl->toArray()])
                        ->log('Tarifvorlage hinzugefügt');
                }
            }
        }
        
    }

    public function handleTariffCategories($entities, Tariff $tariff, bool $update = false){
        if($entities){
            if($update && $tariff && $entities){
                $checkedCategories = array_filter($entities, function ($category) {
                    return $category['checked'];
                });

                $notCheckedCategories = array_filter($entities, function ($category) {                    
                    return $category['checked'] == false;
                });
                
                $categoryIds = array_map(function ($category) {
                    return $category['id'];
                }, $checkedCategories);

                $categoryIdsNodChecked = array_map(function ($category) {
                    return $category['id'];
                }, $notCheckedCategories);

                $tariff->category()->attach($categoryIds);
                $tariff->category()->detach($categoryIdsNodChecked);

                foreach($checkedCategories as $checkedCategorie){
                    activity()
                        ->performedOn($tariff)
                        ->causedBy(Auth::id())
                        ->withProperties(['categorie' => [
                            'category_id' => $checkedCategorie['id'],
                            'tariff_id' => $tariff->id
                        ]])
                        ->log('Kategorien zum Tarif aktualisiert');
                }

                foreach($notCheckedCategories as $notCheckedcheckedCategorie){
                    activity()
                        ->performedOn($tariff)
                        ->causedBy(Auth::id())
                        ->withProperties(['categorie' => [
                            'category_id' => $notCheckedcheckedCategorie['id'],
                            'tariff_id' => $tariff->id
                        ]])
                        ->log('Kategorien vom Tarif entfernt');
                }

            }else{
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
    }

    public function handleTariffComboStatus($entities, Tariff $tariff, bool $update = false){
        if($entities){
            if($update && $tariff && $entities){
                $checkedComboStatuses = array_filter($entities, function ($comboStatus) {
                    return $comboStatus['checked'];
                });

                $notCheckedComboStatuses = array_filter($entities, function ($comboStatus) {
                    return $comboStatus['checked'] == false;
                });

                $comboStatusIds = array_map(function ($comboStatus) {
                    return $comboStatus['id'];
                }, $checkedComboStatuses);

                $comboStatusIdsNotChecked = array_map(function ($comboStatus) {
                    return $comboStatus['id'];
                }, $notCheckedComboStatuses);

                $tariff->comboStatus()->attach($comboStatusIds);
                $tariff->comboStatus()->detach($comboStatusIdsNotChecked);

                foreach($checkedComboStatuses as $checkedComboStatus){
                    activity()
                        ->performedOn($tariff)
                        ->causedBy(Auth::id())
                        ->withProperties(['combo_status' => [
                            'combo_status_id' => $checkedComboStatus['id'],
                            'tariff_id' => $tariff->id
                        ]])
                        ->log('Kombinationstatus zum Tarif aktualisiert');
                }

                foreach($notCheckedComboStatuses as $notCheckedComboStatus){
                    activity()
                        ->performedOn($tariff)
                        ->causedBy(Auth::id())
                        ->withProperties(['combo_status' => [
                            'combo_status_id' => $notCheckedComboStatus['id'],
                            'tariff_id' => $tariff->id
                        ]])
                        ->log('Kombinationstatus vom Tarif entfernt');
                }

            }else{
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

    public function handleDeleted($entities, Tariff $tariff){
        if ($entities) {
            if (isset($entities['attribute_groups'])) {
                $this->handleDeletedAttributeGroups($entities['attribute_groups'], $tariff);
            }

            if (isset($entities['calc_matrix'])) {
                $this->handleDeletedCalcMatrices($entities['calc_matrix'], $tariff);
            }

            if (isset($entities['tpl'])) {
                $this->handleDeletedTpl($entities['tpl'], $tariff);
            }

            if (isset($entities['tariffdetails'])) {
                $this->handleDeletedTariffDetails($entities['tariffdetails'], $tariff);
            }
            if(isset($entities['promos'])){
                $this->handleDeletedPromos($entities['promos'], $tariff);
            }
        }
    }

    protected function handleDeletedAttributeGroups($attributeGroups, Tariff $tariff){
        foreach ($attributeGroups as $groupData) {
            if (isset($groupData['id'])) {
                $groupId = $groupData['id'];
                $attributeGroup = TariffAttributeGroup::find($groupId);

                // Если есть только id и attributs, удалить только перечисленные атрибуты
                if (isset($groupData['attributs']) && count($groupData) == 2) {
                    foreach ($groupData['attributs'] as $attributeData) {
                        if (isset($attributeData['id'])) {
                            $attributeId = $attributeData['id'];

                            // Удаляем связь с группой атрибутов
                            $attributeGroup->attributes()->detach($attributeId);

                            // Удаляем связь с тарифом
                            $tariff->attributes()->detach($attributeId);

                            activity()
                                ->performedOn($tariff)
                                ->causedBy(Auth::id())
                                ->withProperties([
                                    'attribute_group_id' => $groupId,
                                    'attribute_id' => $attributeId
                                ])
                                ->log('Attribut von der Attributgruppe entfernt');
                        }
                    }
                }
                // Если присутствуют дополнительные свойства, удалить всю группу
                // Если присутствуют дополнительные свойства, удалить всю группу
                elseif (isset($groupData['name']) && isset($groupData['uniqueId'])) {
                    // Получаем все атрибуты группы
                    $attributeIds = $attributeGroup->attributes()
                        ->select('tariff_attributes.id') // Явно указываем таблицу
                        ->pluck('id')
                        ->toArray();

                    // Удаляем связи атрибутов с тарифом
                    foreach ($attributeIds as $attributeId) {
                        $tariff->attributes()->detach($attributeId);

                        activity()
                            ->performedOn($tariff)
                            ->causedBy(Auth::id())
                            ->withProperties([
                                'attribute_group_id' => $groupId,
                                'attribute_id' => $attributeId
                            ])
                            ->log('Attribut vom Tarif entfernt');
                    }

                    // Удаляем все связи атрибутов с группой
                    $attributeGroup->attributes()->detach();

                    // Удаляем саму группу
                    $attributeGroup->delete();

                    activity()
                        ->performedOn($tariff)
                        ->causedBy(Auth::id())
                        ->withProperties(['attribute_group_id' => $groupId])
                        ->log('Attributgruppe vom Tarif entfernt');
                }
            }
        }
    }

    protected function handleDeletedCalcMatrices($calcMatrices, Tariff $tariff){
        foreach ($calcMatrices as $matrixData) {
            if (isset($matrixData['id'])) {
                $matrixId = $matrixData['id'];
                $calcMatrix = TariffCalcMatrix::find($matrixId);
    
                if ($calcMatrix) {
                    // Если есть только id и attributs, удалить только перечисленные атрибуты
                    if (isset($matrixData['attributs']) && count($matrixData) == 2) {
                        foreach ($matrixData['attributs'] as $attributeData) {
                            if (isset($attributeData['id'])) {
                                $attributeId = $attributeData['id'];
    
                                // Удаляем связь с матрицей
                                $calcMatrix->attributs()->detach($attributeId);
    
                                activity()
                                    ->performedOn($tariff)
                                    ->causedBy(Auth::id())
                                    ->withProperties([
                                        'calc_matrix_id' => $matrixId,
                                        'attribute_id' => $attributeId
                                    ])
                                    ->log('Attribut von der Kalkulationsmatrix entfernt');
                            }
                        }
                    }
                    // Если присутствуют дополнительные свойства, удалить всю матрицу
                    elseif (
                        isset($matrixData['name'], $matrixData['total_value'], $matrixData['uniqueId'], $matrixData['unit'])
                    ) {
                        // Получаем все атрибуты матрицы
                        $attributeIds = $calcMatrix->attributs()
                            ->select('tariff_attributes.id') // Явно указываем таблицу
                            ->pluck('id')
                            ->toArray();
    
                        // Удаляем связи атрибутов с тарифом
                        foreach ($attributeIds as $attributeId) {
                            $tariff->attributes()->detach($attributeId);
    
                            activity()
                                ->performedOn($tariff)
                                ->causedBy(Auth::id())
                                ->withProperties([
                                    'calc_matrix_id' => $matrixId,
                                    'attribute_id' => $attributeId
                                ])
                                ->log('Attribut vom Tarif entfernt');
                        }
    
                        // Удаляем все связи атрибутов с матрицей
                        $calcMatrix->attributs()->detach();
    
                        // Удаляем саму матрицу
                        $calcMatrix->delete();
    
                        activity()
                            ->performedOn($tariff)
                            ->causedBy(Auth::id())
                            ->withProperties(['calc_matrix_id' => $matrixId])
                            ->log('Kalkulationsmatrix vom Tarif entfernt');
                    }
                }
            }
        }
    }

    protected function handleDeletedTpl($tpls, Tariff $tariff){

        foreach ($tpls as $tplData) {
            if (isset($tplData['id'])) {
                $tplId = $tplData['id'];
                $tariffTpl = TariffTpl::find($tplId);
                //var_dump($tplData['attribute'][0]);
                if ($tariffTpl && isset($tplData['attribute'][0]['id']) && $tariffTpl->attribute_id == $tplData['attribute'][0]['id']) {
                    $tariffTpl->attribute_id = null;
                    $tariffTpl->save();
                    activity()
                        ->performedOn($tariff)
                        ->causedBy(Auth::id())
                        ->withProperties(['tpl_id' => $tplId])
                        ->log('Attribute vom Tarifvorlage entfernt');
                }

                if ($tariffTpl && isset($tplData['matrix'][0]['id']) && $tariffTpl->matrix_id == $tplData['matrix'][0]['id']) {
                    $tariffTpl->matrix_id  = null;
                    $tariffTpl->save();
                    activity()
                        ->performedOn($tariff)
                        ->causedBy(Auth::id())
                        ->withProperties(['tpl_id' => $tplId])
                        ->log('Matrix vom Tarifvorlage entfernt');
                }
            }
        }
    }

    protected function handleDeletedTariffDetails($tariffDetails, Tariff $tariff){

        foreach ($tariffDetails as $detailData) {
            if (isset($detailData['id'])) {
                $detailId = $detailData['id'];
                $tariffDetail = TariffDetail::find($detailId);
                if ($tariffDetail && count($detailData) > 2) {
                    $tariffDetail->delete();
                    activity()
                        ->performedOn($tariff)
                        ->causedBy(Auth::id())
                        ->withProperties(['tariff_detail_id' => $detailId])
                        ->log('Tarifdetail vom Tarif entfernt');
                }
            }
        }
    }

    protected function handleDeletedPromos($promos, Tariff $tariff){

        foreach ($promos as $promoData) {
            if (isset($promoData['id'])) {
                $promoId = $promoData['id'];
                $promo = TariffPromotion::find($promoId);

                if ($promo) {
                    // Удаляем Promo
                    $promo->delete();

                    activity()
                        ->performedOn($tariff)
                        ->causedBy(Auth::id())
                        ->withProperties(['promo_id' => $promoId])
                        ->log('Promoaktion vollständig gelöscht');
                    
                }
            }
        }
    }

}