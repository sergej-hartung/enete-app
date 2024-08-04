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
          matrix.attributes.forEach((attr:any, attrIndex: number) => {
            if(attr.attribute_id === attribute.id && attr.value !== attribute.value_varchar){
              this.updateMatrixAttribute(matrixIndex, attrIndex, attribute.value_varchar);
            }
          })
        });
      });
    });
  }

  updateMatrixAttribute(matrixIndex:number, attrIndex: number, newValue: string) {
    let matrices = this.getCalcMatrixArray()
    const matrix = matrices.at(matrixIndex) as FormGroup
    const attributes = matrix.get('attributes') as FormArray
    attributes.at(attrIndex).patchValue({ value: newValue })

    this.updateTotalValue(attributes.at(attrIndex) as FormGroup, matrix)
  }

  updateTotalValue(attributeFormGroup: FormGroup, matrix: FormGroup) {
    const valueControl = attributeFormGroup.get('value');
    const periodControl = attributeFormGroup.get('period');
    const valueTotalControl = attributeFormGroup.get('value_total');

    if (valueControl && periodControl && valueTotalControl) {
      const value = parseFloat(valueControl.value);
      const period = parseInt(periodControl.value, 10);
      if (!isNaN(value) && !isNaN(period)) {
        valueTotalControl.setValue(value * period);
      } else {
        if(isNaN(value)){
          valueTotalControl.setValue(0);
        }else{
          valueTotalControl.setValue(value);
        }
      }
      this.updateTotalValueMatrix(matrix)
    }
  }

  updateTotalValueMatrix(matrix: any){
    console.log(matrix)
    if(matrix){
      const Attributes = matrix?.value?.attributes 
      let MatrixTotalValue = 0
      let unitSet = new Set<string>();

      if(Attributes){
        Attributes.forEach((attr:any) => {
          if (attr?.unit !== undefined) {
              unitSet.add(attr.unit);
          }
          if(attr?.value_total !== undefined){
            MatrixTotalValue += parseFloat(attr?.value_total)
            //matrix.setValue({}).total_value += attr?.value_total
          }
        })

        // Проверка и установка unit
        const unit = matrix.get('unit')
        if (unitSet.size === 1) {
          
            if(unit) unit.setValue(Array.from(unitSet)[0]);
        } else {
            // Если unit отличаются
            if(unit) unit.setValue('');
        }

        const totalValue = matrix.get('total_value');
        if(totalValue) totalValue.setValue(MatrixTotalValue)
      }
    }
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
