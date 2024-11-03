import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormService } from '../../../../services/form.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Attribute } from '../../../../models/tariff/attribute/attribute';
import { Subject, takeUntil } from 'rxjs';
import { CalcMatrix, calcMatrixAttr, Template } from '../../../../models/tariff/tariff';
import { AttributeGroup } from '../../../../models/tariff/attributeGroup/attributeGroup';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-tariff-add-edit',
  templateUrl: './tariff-add-edit.component.html',
  styleUrls: ['./tariff-add-edit.component.scss']
})
export class TariffAddEditComponent  implements OnInit, OnDestroy {

  active = 1
  tariffForm: FormGroup

  private unsubscribe$ = new Subject<void>();

  
  constructor(
    private formService: FormService,
    private fb: FormBuilder,
  ) {
    this.tariffForm = this.formService.getTariffForm()
  }

  ngOnInit() {
    this.tariffForm.valueChanges
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          console.log(this.tariffForm.valid)
        });
  }

  // subscribeToFormChanges() {
  //   const attributeGroupsControl = this.attributeGroupsControl;
  //   const calcMatrixControl = this.calcMatrixControl;

  //   attributeGroupsControl.valueChanges
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe(() => {
  //       this.syncCalcMatrix();
  //       this.syncAttributesWithTemplate();
  //       this.syncTariffDetails();
  //     });

  //   calcMatrixControl.valueChanges
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe((newCalcMatrix: CalcMatrix[]) => {
  //       this.syncTplArrayWithMatrix(newCalcMatrix);
  //     });
  // }

  // syncCalcMatrix() {
  //   const calcMatrices = this.calcMatrixControl?.value;
  //   const attributeGroups = this.attributeGroupsControl?.value;
  //   calcMatrices.forEach((matrix: any, index: number) => {
      
  //     if("attributs" in matrix){
  //       matrix.attributs.forEach((mattrixAttr: any, matrixAttrIndex: number) => {
  //         let AttrExist = false
  //         attributeGroups.forEach((group: any) => {
  //           if("attributs" in group){
  //             const attributIndex = group.attributs.findIndex((element: any) => element.id == mattrixAttr.id) 
  //             console.log(attributIndex)
  //             if(attributIndex !== -1){
  //               AttrExist = true
  //               const attribut = group.attributs.at(attributIndex)
  //               console.log(index)
  //               console.log(matrixAttrIndex)
  //               console.log(attribut.value_varchar)
  //               console.log(mattrixAttr)
  //               console.log(attribut)
  //               console.log(this.shouldUpdateMatrixAttribute(mattrixAttr, attribut))
  //               if(this.shouldUpdateMatrixAttribute(mattrixAttr, attribut)){
  //                 this.updateMatrixAttribute(index, matrixAttrIndex, attribut.value_varchar)
  //               }
  //             }
  //           }
  //         })

  //         // delete 
  //         if(!AttrExist){
  //           console.log(matrix)
  //           console.log(mattrixAttr)
  //           const Matrices = this.calcMatrixControl;
  //           const Matrix = Matrices.at(index) as FormGroup;
  //           const attributs = Matrix.get('attributs') as FormArray;
            
  //           attributs.removeAt(matrixAttrIndex)
  //           //this.updateMatrixAttribute(index, matrixAttrIndex, attribut.value_varchar)
  //           this.updateTplMatrix(Matrix);
  //           //this.updateTotalValueMatrix(Matrix)
  //           //attributs.at(attrIndex).patchValue({ value: newValue });
  //           // let tpl = this.tplArrayControl.at(index) as FormGroup;
  //           // tpl.removeControl('attribute');
  //         } 
  //       })
  //     }
      
  //     console.log(matrix)
  //   })
  //   // const calcMatrixArray = this.calcMatrixControl;
  //   // console.log(calcMatrixArray)
  //   // calcMatrixArray.controls.forEach((matrix, matrixIndex) => {
  //   //   this.updateTplMatrix(matrix as FormGroup);
  //   // });
  // }
  // syncCalcMatrix() {
  //   const calcMatrices = this.calcMatrixControl.value as CalcMatrix[];
  //   const attributeGroups = this.attributeGroupsControl.value as AttributeGroup[];

  //   calcMatrices.forEach((matrix, index) => {
  //     if (matrix.attributs) {
  //       matrix.attributs.forEach((matrixAttr, matrixAttrIndex) => {
  //         let attrExists = false;

  //         attributeGroups.forEach((group) => {
  //           if (group.attributs) {
  //             const attributeIndex = group.attributs.findIndex(
  //               (attr) => attr.id === matrixAttr.id
  //             );

  //             if (attributeIndex !== -1) {
  //               attrExists = true;
  //               const attribute = group.attributs[attributeIndex];

  //               if (this.shouldUpdateMatrixAttribute(matrixAttr, attribute)) {
  //                 this.updateMatrixAttribute(index, matrixAttrIndex, attribute.value_varchar);
  //               }
  //             }
  //           }
  //         });

  //         if (!attrExists) {
  //           this.removeMatrixAttribute(index, matrixAttrIndex);
  //         }
  //       });
  //     }
  //   });
  // }

  // syncTplArrayWithMatrix(newCalcMatrix: any[]) {
  //   const tplArrayControl = this.tplArrayControl;
  
  //   // Проходим по каждому шаблону и обновляем или удаляем его матрицу
  //   tplArrayControl.controls.forEach((tplControl: any, index: number) => {
  //     const tplMatrix = tplControl.get('matrix');
      
  //     // Поиск соответствующей матрицы в newCalcMatrix
  //     const correspondingMatrix = newCalcMatrix.find(matrix => 
  //       matrix.id === tplMatrix?.get('id')?.value || 
  //       matrix.uniqueId === tplMatrix?.get('uniqueId')?.value
  //     );
  
  //     if (correspondingMatrix) {
  //       // Если матрица найдена и отличается, обновляем значение
  //       if (!this.deepEqual(correspondingMatrix, tplMatrix?.value)) {
  //         tplMatrix?.patchValue(correspondingMatrix);
  //       }
  //     } 
  //     // else {
  //     //   // Если соответствующей матрицы нет, удаляем матрицу из tplArrayControl
  //     //   //tplArrayControl.removeAt(index);
  //     //   tplControl.removeControl('matrix');
  //     //   console.log(tplControl)
  //     // }
  //   });
  // }

  // syncTplArrayWithMatrix(newCalcMatrix: CalcMatrix[]) {
  //   const tplArrayControl = this.tplArrayControl;

  //   tplArrayControl.controls.forEach((tplControl: any, index: number) => {
  //     const tplMatrix = tplControl.get('matrix') as FormGroup;

  //     const correspondingMatrix = newCalcMatrix.find((matrix) =>
  //       matrix.id === tplMatrix?.get('id')?.value ||
  //       matrix.uniqueId === tplMatrix?.get('uniqueId')?.value
  //     );

  //     if (correspondingMatrix) {
  //       if (!this.deepEqual(correspondingMatrix, tplMatrix.value)) {
  //         tplMatrix.patchValue(correspondingMatrix);
  //       }
  //     } else {
  //       //tplControl.removeControl('matrix');
  //     }
  //   });
  // }

  // syncTariffDetails(){
  //   //tariffDetails: AttributeGroup[]
  //   console.log('syncTariffDetails')
  //   const attributeGroups = this.attributeGroupsControl?.value;
  //   const tariffDetails = this.tariffDetails?.value;

  //   if(tariffDetails){
  //     tariffDetails.forEach((tariffDetail: any, tariffDetailIndex: number) => {
  //       if(tariffDetail.id){
  //         const attributGroupIndex = attributeGroups.findIndex((element: any) => element.id == tariffDetail.id)
  //         if(attributGroupIndex !== -1){
  //           const attributGroup = attributeGroups.at(attributGroupIndex)
  //           if(!this.deepEqual(attributGroup, tariffDetail)){
  //             this.tariffDetails.removeAt(tariffDetailIndex);
  //             this.tariffDetails.insert(tariffDetailIndex, this.setTariffDeailsItem(attributGroup));
  //           }
  //         }else{
  //           this.tariffDetails.removeAt(tariffDetailIndex);
  //         }
          
  //       }else{
  //         //const attributGroup = attributeGroups.find((element: any) => element.uniqueId == tariffDetail.uniqueId )
  //         const attributGroupIndex = attributeGroups.findIndex((element: any) => element.uniqueId == tariffDetail.uniqueId)
  //         if(attributGroupIndex !== -1){
  //           const attributGroup = attributeGroups.at(attributGroupIndex)
  //           if(!this.deepEqual(attributGroup, tariffDetail)){
  //             this.tariffDetails.removeAt(tariffDetailIndex);
  //             this.tariffDetails.insert(tariffDetailIndex, this.setTariffDeailsItem(attributGroup));
  //           }
  //         }else{
  //           this.tariffDetails.removeAt(tariffDetailIndex);
  //         }
  //       }
  //     })
  //   }
  // }

  // syncTariffDetails() {
  //   const attributeGroups = this.attributeGroupsControl.value as AttributeGroup[];
  //   const tariffDetails = this.tariffDetails.value as AttributeGroup[];

  //   if (tariffDetails) {
  //     tariffDetails.forEach((tariffDetail, tariffDetailIndex) => {
  //       let groupIndex: number;

  //       if (tariffDetail.id) {
  //         groupIndex = attributeGroups.findIndex((group) => group.id === tariffDetail.id);
  //       } else {
  //         groupIndex = attributeGroups.findIndex((group) => group.uniqueId === tariffDetail.uniqueId);
  //       }

  //       if (groupIndex !== -1) {
  //         const attributeGroup = attributeGroups[groupIndex];
  //         if (!this.deepEqual(attributeGroup, tariffDetail)) {
  //           this.tariffDetails.setControl(tariffDetailIndex, this.setTariffDetailsItem(attributeGroup));
  //         }
  //       } else {
  //         this.tariffDetails.removeAt(tariffDetailIndex);
  //       }
  //     });
  //   }
  // }

  // setTariffDeailsItem(attributGroup: AttributeGroup){
  //   return this.fb.group({
  //     id: [attributGroup.id],
  //     name: [attributGroup.name],
  //     uniqueId: [attributGroup?.uniqueId],
  //     attributs: this.fb.array(
  //       attributGroup.attributs.map(attr => this.createAttributeFormControl(attr))
  //     )
  //   }); 
  // }

  // setTariffDetailsItem(attributeGroup: AttributeGroup): FormGroup {
  //   return this.fb.group({
  //     id: [attributeGroup.id],
  //     name: [attributeGroup.name],
  //     uniqueId: [attributeGroup.uniqueId],
  //     attributs: this.fb.array(
  //       attributeGroup.attributs.map((attr) => this.createAttributeFormControl(attr))
  //     )
  //   });
  // }

  // createAttributeFormControl(attr: Attribute){
  //   return this.fb.group({
  //     id: [attr.id],
  //     code: [attr.code],
  //     name: [attr.name],
  //     unit: [attr.unit],
  //     value_varchar: [attr?.value_varchar],
  //     value_text: [attr?.value_text],
  //     is_active: [attr?.is_active]
  //   });
  // }

  // createAttributeFormControl(attr: Attribute): FormGroup {
  //   return this.fb.group({
  //     id: [attr.id],
  //     code: [attr.code],
  //     name: [attr.name],
  //     unit: [attr.unit],
  //     value_varchar: [attr.value_varchar],
  //     value_text: [attr.value_text],
  //     is_active: [attr.is_active]
  //   });
  // }

  // syncAttributsWithTemplate() {
  //   const attributeGroups = this.attributeGroupsControl?.value;
  //   const calcMatrices = this.calcMatrixControl?.value;
  //   const templateArray = this.tplArrayControl?.value;
  //   console.log(templateArray)
  //   // console.log(attributeGroups[0])
  //   // console.log(tariffDetails[0])
  //   // console.log(this.deepEqual(attributeGroups[0], tariffDetails[0]))
  //   templateArray.forEach((tpl:any, index: number) => {
  //     //console.log("attribute" in tpl)
  //     let AttrExist = false
  //     if("attribute" in tpl){
  //       attributeGroups.forEach((group: any) => {
  //         //console.log(group)
  //         if("attributs" in group){
  //           const attributIndex = group.attributs.findIndex((element: any) => element.id == tpl.attribute.id) 
  //           //console.log(tpl)
  //           //console.log(attributIndex)
  //           if(attributIndex !== -1){
  //             AttrExist = true
  //             const attribut = group.attributs.at(attributIndex)
  //             //console.log(attribut)
  //             //console.log(this.deepEqual(attribut, tpl.attribute))
  //             if(!this.deepEqual(attribut, tpl.attribute)){
  //               this.updateTemplateAttribute(index, attribut)
  //             }
  //           }
  //         }
          
  //       })
  //       // löschen attribut von Tpl
  //       if(!AttrExist){
  //         let tpl = this.tplArrayControl.at(index) as FormGroup;
  //         tpl.removeControl('attribute');
  //       } 
  //       //console.log(AttrExist)
  //     }

  //     // if('matrix' in tpl){
  //     //   // calcMatrices.forEach((matrix: any) => {
  //     //   //   if(matrix.id && tpl.matrix.id == matrix.id){
  //     //   //     if(!this.deepEqual(matrix, tpl.matrix)){
  //     //   //       this.updateTemplateMatrix(index, matrix)
  //     //   //     }
  //     //   //   }else if(matrix.uniqueId && tpl.matrix.uniqueId == matrix.uniqueId){
  //     //   //     if(!this.deepEqual(matrix, tpl.matrix)){
  //     //   //       this.updateTemplateMatrix(index, matrix)
  //     //   //     }
  //     //   //   }
  //     //   //   console.log(matrix)
  //     //   // })
  //     // }
  //   })
  //   // attributeGroups.forEach((group: any) => {
  //   //   if(group?.attributs){
  //   //     group.attributs.forEach((attribute: any) => {
  //   //       this.syncAttribute(attribute, calcMatrices, templateArray);
  //   //     });
  //   //   }
      
  //   // });
  // }
  
  
  // syncAttribute(attribute: Attribute, calcMatrices: CalcMatrix[], templateArray: Template[]) {
  //   this.syncAttributeWithMatrix(attribute, calcMatrices);
  //   //this.syncAttributeWithTemplate(attribute, templateArray);
  // }

  // syncAttributeWithMatrix(attribute: Attribute, calcMatrices: CalcMatrix[]) {
  //   calcMatrices.forEach((matrix, matrixIndex) => {
  //     matrix.attributs.forEach((attr, attrIndex) => {
  //       if (this.shouldUpdateMatrixAttribute(attr, attribute)) {
  //         this.updateMatrixAttribute(matrixIndex, attrIndex, attribute?.value_varchar);
  //       }
  //     });
  //   });
  // }

  // syncAttributesWithTemplate() {
  //   const attributeGroups = this.attributeGroupsControl.value as AttributeGroup[];
  //   const templateArray = this.tplArrayControl.value as Template[];

  //   templateArray.forEach((tpl, index) => {
  //     let attrExists = false;
  //     if (tpl.attribute) {
  //       attributeGroups.forEach((group) => {
  //         if (group.attributs) {
  //           const attributeIndex = group.attributs.findIndex(
  //             (attr) => attr.id === tpl?.attribute?.id
  //           );

  //           if (attributeIndex !== -1) {
  //             attrExists = true;
  //             const attribute = group.attributs[attributeIndex];

  //             if (!this.deepEqual(attribute, tpl.attribute)) {
  //               this.updateTemplateAttribute(index, attribute);
  //             }
  //           }
  //         }
  //       });

  //       if (!attrExists) {
  //         const tplControl = this.tplArrayControl.at(index) as FormGroup;
  //         tplControl.removeControl('attribute');
  //       }
  //     }
  //   });
  // }

  // shouldUpdateMatrixAttribute(attr: calcMatrixAttr, attribute: Attribute ): boolean {
  //   return attr.id === attribute.id && attr.value !== attribute.value_varchar;
  // }
  
  // shouldUpdateMatrixAttribute(matrixAttr: calcMatrixAttr, attribute: Attribute): boolean {
  //   return matrixAttr.id === attribute.id && matrixAttr.value !== attribute.value_varchar;
  // }

  // syncAttributeWithTemplate(attribute: Attribute, templates: Template[]) {
  //   templates.forEach((template, templateIndex) => {
  //     const templateAttr = template.attribute; 
  //     if (templateAttr && this.shouldUpdateTemplateAttribute(templateAttr, attribute)) {
  //       this.updateTemplateAttribute(templateIndex, attribute);
  //     }
  //   });
  // }

  // shouldUpdateTariffDetailsAttribute(attr:Attribute ,attribute: Attribute){
  //   return attr.id === attribute.id && (attr.value_varchar !== attribute.value_varchar || attr.value_text !== attribute.value_text)
  // }



  // updateTariffDetailsAttribute(AttrGroupIndex: number , attrIndex: number, attribute: Attribute){
  //   console.log('update tarifdetails')
  //   const tariffDetailsGroup = this.tariffDetails
  //   const tariffDetails = tariffDetailsGroup.at(AttrGroupIndex) as FormGroup
  //   const attrs = tariffDetails.get('attributs') as FormArray 
  //   const attrValue = attrs.at(attrIndex)?.value
  //   if(attrValue.value_varchar !== attribute.value_varchar){
  //     attrs.at(attrIndex)?.patchValue({value_varchar: attribute.value_varchar})
  //   }
  //   if(attrValue.value_text !== attribute.value_text){
  //     attrs.at(attrIndex)?.patchValue({value_text: attribute.value_text})
  //   }
  // }
  

  // shouldUpdateTemplateAttribute(templateAttr: Attribute, attribute: Attribute): boolean {
  //   return templateAttr?.id === attribute.id &&
  //     (templateAttr?.value_varchar !== attribute?.value_varchar || templateAttr?.value_text !== attribute?.value_text);
  // }

  // updateMatrixAttribute(matrixIndex: number, attrIndex: number, newValue: string | undefined) {
  //   const matrices = this.calcMatrixControl;
  //   const matrix = matrices.at(matrixIndex) as FormGroup;
  //   const attributs = matrix.get('attributs') as FormArray;
  //   attributs.at(attrIndex).patchValue({ value: newValue });

  //   this.updateTotalValue(attributs.at(attrIndex) as FormGroup, matrix);
  //   this.updateTplMatrix(matrix);
  // }

  // updateMatrixAttribute(matrixIndex: number, attrIndex: number, newValue: string | undefined) {
  //   const matrices = this.calcMatrixControl;
  //   const matrix = matrices.at(matrixIndex) as FormGroup;
  //   const attributs = matrix.get('attributs') as FormArray;
  //   attributs.at(attrIndex).patchValue({ value: newValue });

  //   this.updateTotalValue(attributs.at(attrIndex) as FormGroup, matrix);
  //   this.updateTplMatrix(matrix);
  // }

  // updateTplMatrix(matrix: FormGroup) {
  //   const tplsForm = this.tplArrayControl;
  //   const tpls = tplsForm?.value;

  //   tpls.forEach((tpl: any, tplIndex: number) => {
  //     if (this.isSameMatrix(tpl.matrix, matrix)) {
  //       const template = tplsForm.at(tplIndex) as FormGroup;
  //       template.get('matrix')?.patchValue(matrix.value);
  //     }
  //   });
  // }

  // removeMatrixAttribute(matrixIndex: number, attrIndex: number) {
  //   const matrices = this.calcMatrixControl;
  //   const matrix = matrices.at(matrixIndex) as FormGroup;
  //   const attributs = matrix.get('attributs') as FormArray;

  //   attributs.removeAt(attrIndex);
  //   this.updateTplMatrix(matrix);
  // }

  // updateTplMatrix(matrix: FormGroup) {
  //   const tplsForm = this.tplArrayControl;
  //   const tpls = tplsForm.value as Template[];

  //   tpls.forEach((tpl, tplIndex) => {
  //     if (this.isSameMatrix(tpl.matrix, matrix)) {
  //       const template = tplsForm.at(tplIndex) as FormGroup;
  //       template.get('matrix')?.patchValue(matrix.value);
  //     }
  //   });
  // }

  // isSameMatrix(tplMatrix: any, formMatrix: FormGroup): boolean {
  //   return tplMatrix?.id === formMatrix?.get('id')?.value || tplMatrix?.uniqueId === formMatrix?.get('uniqueId')?.value;
  // }

  // isSameMatrix(tplMatrix: any, formMatrix: FormGroup): boolean {
  //   return tplMatrix?.id === formMatrix.get('id')?.value || tplMatrix?.uniqueId === formMatrix.get('uniqueId')?.value;
  // }


  // updateTemplateAttribute(index: number, attribute: any) {
  //   const tpl = this.tplArrayControl.at(index);
  //   tpl.get('attribute')?.patchValue(attribute);
  // }

  // updateTemplateAttribute(index: number, attribute: Attribute) {
  //   const tpl = this.tplArrayControl.at(index) as FormGroup;
  //   tpl.get('attribute')?.patchValue(attribute);
  // }


  // updateTotalValue(attributeFormGroup: FormGroup, matrix: FormGroup) {
  //   const valueControl = attributeFormGroup.get('value');
  //   const periodControl = attributeFormGroup.get('period');
  //   const valueTotalControl = attributeFormGroup.get('value_total');

  //   if (valueControl && periodControl && valueTotalControl) {
  //     const value = parseFloat(valueControl.value.replace(',', '.'));
  //     const period = parseInt(periodControl.value, 10);
  //     valueTotalControl.setValue(!isNaN(value) && !isNaN(period) ? value * period : isNaN(value) ? 0 : value);
  //     this.updateTotalValueMatrix(matrix);
  //   }
  // }

  // updateTotalValue(attributeFormGroup: FormGroup, matrix: FormGroup) {
  //   const valueControl = attributeFormGroup.get('value');
  //   const periodControl = attributeFormGroup.get('period');
  //   const valueTotalControl = attributeFormGroup.get('value_total');

  //   const value = parseFloat(valueControl?.value.replace(',', '.') || '0');
  //   const period = parseInt(periodControl?.value, 10);

  //   if (valueTotalControl) {
  //     valueTotalControl.setValue(
  //       !isNaN(value) && !isNaN(period) ? value * period : isNaN(value) ? 0 : value
  //     );
  //   }

  //   this.updateTotalValueMatrix(matrix);
  // }

  // updateTotalValueMatrix(matrix: FormGroup) {
  //   const attributs = matrix.get('attributs')?.value || [];
  //   let totalValue = 0;
  //   let units = new Set<string>();

  //   attributs.forEach((attr: any) => {
  //     if (attr?.unit) units.add(attr.unit);
  //     totalValue += parseFloat(attr?.value_total || 0);
  //   });

  //   matrix.get('unit')?.setValue(units.size === 1 ? Array.from(units)[0] : '');
  //   matrix.get('total_value')?.setValue(totalValue);
  // }

  // updateTotalValueMatrix(matrix: FormGroup) {
  //   const attributs = matrix.get('attributs')?.value || [];
  //   let totalValue = 0;
  //   const units = new Set<string>();

  //   attributs.forEach((attr: any) => {
  //     if (attr?.unit) units.add(attr.unit);
  //     totalValue += parseFloat(attr?.value_total || 0);
  //   });

  //   matrix.get('unit')?.setValue(units.size === 1 ? Array.from(units)[0] : '');
  //   matrix.get('total_value')?.setValue(totalValue);
  // }

  // deepEqual(obj1: any, obj2: any): boolean {
  //   if (obj1 === obj2) return true;
    
  //   if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
  //     return false;
  //   }
  
  //   let keys1 = Object.keys(obj1);
  //   let keys2 = Object.keys(obj2);
  
  //   if (keys1.length !== keys2.length) return false;
  
  //   for (let key of keys1) {
  //     if (!keys2.includes(key) || !this.deepEqual(obj1[key], obj2[key])) {
  //       return false;
  //     }
  //   }
  
  //   return true;
  // }

  // get attributeGroupsControl() {
  //   return this.tariffForm.get('attribute_groups') as FormArray;
  // }

  // get calcMatrixControl() {
  //   return this.tariffForm.get('calc_matrix') as FormArray;
  // }

  // get tplArrayControl(): FormArray {
  //   return this.tariffForm.get('tpl') as FormArray;
  // }

  // get tariffDetails(): FormArray{
  //   return this.tariffForm.get('tariffdetails') as FormArray
  // }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
