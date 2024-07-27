import { Component } from '@angular/core';
import { FormService } from '../../../../services/form.service';
import { FormArray, FormGroup } from '@angular/forms';
import { Attribute } from '../../../../models/tariff/attribute/attribute';

@Component({
  selector: 'app-tariff-add-edit',
  templateUrl: './tariff-add-edit.component.html',
  styleUrl: './tariff-add-edit.component.scss'
})
export class TariffAddEditComponent {

  active = 1
  tariffForm: FormGroup

  
  constructor(
    private formService: FormService
  ) {
    this.tariffForm = this.formService.getTariffForm()
  }

  ngOnInit() {
    this.subscribeToAttributeGroupChanges();
  }

  subscribeToAttributeGroupChanges() {
    // this.getAttributeGroupArray().controls.forEach((control, index) => {
    //   console.log(control)
    //   const group = control as FormGroup; // Cast AbstractControl to FormGroup
    //   group.valueChanges.subscribe(() => {
    //     console.log('changes')
    //     this.checkAndSyncAttributes();
    //   });
    // });

    this.tariffForm.get('attribute_groups')?.valueChanges.subscribe((value) => {
      console.log('Name field changes:', value);
      this.checkAndSyncAttributes()
    });
  }
  
  checkAndSyncAttributes() {
    const attributeGroups = this.getAttributeGroupArray().value;
    const matrices = this.getCalcMatrixArray().value;

    attributeGroups.forEach((group: any) => {
      group.attributes.forEach((attribute: any) => {
        matrices.forEach((matrix: any, matrixIndex: number) => {
          const foundAttribute = matrix.attributes.find((attr: any) => attr.attribute_id === attribute.id);
          // console.log(attribute)
          // console.log(matrix)
          // console.log(foundAttribute)
          // console.log(attribute.value_varchar)
          // if (foundAttribute && foundAttribute.value !== attribute.value_varchar) {
          //   console.log(attribute)
          // console.log(matrix)
          // console.log(foundAttribute)
          // console.log(attribute.value_varchar)
          //   this.updateMatrixAttribute(foundAttribute, attribute.value_varchar);
          // }
          matrix.attributes.forEach((attr:any, attrIndex: number) => {
            if(attr.attribute_id === attribute.id && attr.value !== attribute.value_varchar){
              console.log(matrixIndex)
              console.log(attrIndex)
              console.log(attribute)
              console.log(matrix)
              console.log(attr)
              console.log(attribute.value_varchar)
              this.updateMatrixAttribute(matrixIndex, attrIndex, attribute.value_varchar);
            }
          })
        });
      });
    });
  }

  updateMatrixAttribute(matrixIndex:number, attrIndex: number, newValue: string) {
    let matrices = this.getCalcMatrixArray()
    const matrix = matrices.at(matrixIndex)
    const attributes = matrix.get('attributes') as FormArray
    attributes.at(attrIndex).patchValue({ value: newValue })
    //matrices.at(index).patchValue({value: newValue})
    //matrix.patchValue({ value: newValue })
    // const attribute = matrix.attributes.find((attr: any) => attr.attribute_id === attributeId);
    // if (attribute) {
    //   attribute.value = newValue;
    //   const attributesFormArray = matrix.form.get('attributes') as FormArray;
    //   const formIndex = attributesFormArray.controls.findIndex(ctrl => ctrl.value.attribute_id === attributeId);
    //   if (formIndex >= 0) {
    //     attributesFormArray.at(formIndex).patchValue({ value: newValue });
    //   }
    // }
  }


  getAttributeGroupArray(): FormArray {
    return this.tariffForm.get('attribute_groups') as FormArray;
  }

  getCalcMatrixArray(): FormArray {
    return this.tariffForm.get('calc_matrix') as FormArray;
  }
  
  ngOnDestroy() {
    
    //this.formService.tariffForm.reset()
    
  }
}
