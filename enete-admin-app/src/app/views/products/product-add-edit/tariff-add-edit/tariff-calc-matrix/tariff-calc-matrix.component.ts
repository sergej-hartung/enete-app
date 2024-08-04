import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Attribute } from '../../../../../models/tariff/attribute/attribute';
import { FormService } from '../../../../../services/form.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subject, takeUntil } from 'rxjs';

interface Matrix {
  id?: number;
  name: string;
  attributes: any[];
  form: FormGroup; // Убедимся, что form всегда определяется как FormGroup
  hidden?: boolean;
}

// interface Group {
//   id?: number;
//   name: string;
//   attributes: Attribute[];
//   form: FormGroup; // Убедимся, что form всегда определяется как FormGroup
//   hidden?: boolean;
// }

@Component({
  selector: 'app-tariff-calc-matrix',
  templateUrl: './tariff-calc-matrix.component.html',
  styleUrl: './tariff-calc-matrix.component.scss'
})
export class TariffCalcMatrixComponent {

  addNewMatrix = false;
  newMatrixForm: FormGroup;
  editMatrixForm: FormGroup;

  tariffAttributes: Attribute[] = [];
  matrixs: Matrix[] = [];
  hiddenGroups: boolean[] = [];
  //groupsу: Group[] = [];

  editMatrixIndex: number | null = null;

  tariffDropListId = 'tariffDropList';
  connectedDropLists: string[] = [this.tariffDropListId];

  tariffForm: FormGroup
  calcMatrixForm: FormArray

  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
  ){
    this.tariffForm = this.formService.getTariffForm()
    this.calcMatrixForm = this.tariffForm.get('calc_matrix') as FormArray

    this.newMatrixForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.editMatrixForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    console.log('load matrix')
    //this.updateConnectedDropLists();
  }

  

  onSaveNewMatrix(){
    if (this.newMatrixForm.valid) {
      const newMatrix: Matrix = {
        name: this.newMatrixForm.value.name,
        attributes: [],
        form: this.fb.group({
          id: [null],
          name: [this.newMatrixForm.value.name],
          attributes: this.fb.array([])
        })
      };
      this.matrixs.push(newMatrix);
      this.calcMatrixForm.push(newMatrix.form);
      console.log(this.matrixs)
      this.updateConnectedDropLists()
      //this.updateConnectedDropLists();
      this.addNewMatrix = false;
      this.newMatrixForm.reset();
    }
  }

  onSaveEditedMatrix() {
    if (this.editMatrixForm.valid && this.editMatrixIndex !== null) {
      this.matrixs[this.editMatrixIndex].name = this.editMatrixForm.value.name;
      const matrixForm = this.calcMatrixForm.at(this.editMatrixIndex) as FormGroup;
      matrixForm.patchValue({ name: this.editMatrixForm.value.name });
      this.editMatrixIndex = null;
      this.editMatrixForm.reset();
    }
  }

  onCancelNewMatrix(){
    this.addNewMatrix = false;
    this.newMatrixForm.reset();
  }

  onCancelEditGroup() {
    this.editMatrixIndex = null;
    this.editMatrixForm.reset();
  }

  onToggleMatrixs(index: number) {
    this.matrixs[index].hidden = !this.matrixs[index].hidden;
  }

  onToggleGroupVisibility(index: number) {
    this.hiddenGroups[index] = !this.hiddenGroups[index];
  }

  onEditMatrix(index: number) {
    this.editMatrixIndex = index;
    this.editMatrixForm.setValue({ name: this.matrixs[index].name });
  }

  onRemoveMatrix(index: number) {
    this.matrixs.splice(index, 1);
    this.calcMatrixForm.removeAt(index);
    this.updateConnectedDropLists();
    //this.updateTariffAttributesStatus(); // Обновление статуса после удаления группы
  }

  onGetMatrixDropListId(index: number): string {
    return `matrixDropList-${index}`;
  }

  onAddNewMatrix(){
    this.addNewMatrix = true;
    this.newMatrixForm.reset();
  }


  drop(event: CdkDragDrop<any[]>, matrix?: Matrix) {
    
    if (event.previousContainer === event.container && matrix) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.moveAttributeInFormArray(matrix, event.previousIndex, event.currentIndex);
    } else {
      const attribute = event.previousContainer.data[event.previousIndex];
      if (matrix) {
        // Проверяем, существует ли атрибут с таким же id в целевой матрице
        // const attributeExists = matrix.attributes.some(attr => attr.id === attribute.id);
        // if (!attributeExists) {
        //   this.addAttributeToMatrix(matrix, attribute);
        // }
        if(attribute?.value_varchar){
          this.addAttributeToMatrix(matrix, attribute);
        }
        
      }
    }
    console.log(this.tariffForm)
  }

  moveAttributeInFormArray(matrix: Matrix, previousIndex: number, currentIndex: number) {
    const attributesFormArray = matrix.form.get('attributes') as FormArray;
    const attribute = attributesFormArray.at(previousIndex);
    attributesFormArray.removeAt(previousIndex);
    attributesFormArray.insert(currentIndex, attribute);
  }

  addAttributeToMatrix(matrix: Matrix, attribute: any) {
    // const attributeExists = matrix.attributes.some(attr => attr.id === attribute.id);
    // if (!attributeExists) {
    //   matrix.attributes.push(attribute);
    //   const attributesFormArray = matrix.form.get('attributes') as FormArray;
    //   attributesFormArray.push(this.fb.group({
    //     id: [null],
    //     attribute_id: [attribute.id],
    //     code: [attribute.code],
    //     name: [attribute.name],
    //     value: [attribute.value_varchar],
    //     value_total: [0],
    //     unit: [attribute.unit],
    //     single: [true],
    //     number: [''],
    //     period: [''],
    //     periodeTyp: ['']
    //   }));
    // }
      matrix.attributes.push(attribute);
      const attributesFormArray = matrix.form.get('attributes') as FormArray;
      const attributeFormGroup = this.fb.group({
        id: [null],
        attribute_id: [attribute.id],
        code: [attribute.code],
        name: [attribute.name],
        value: [attribute.value_varchar],
        value_total: [0],
        unit: [attribute.unit],
        single: [true],
        period: [''],
        periodeTyp: ['']
      });
  
      attributesFormArray.push(attributeFormGroup);
  
      this.addFormSwitchListener(attributeFormGroup);
  }

  addFormSwitchListener(attributeFormGroup: FormGroup) {
    const singleControl = attributeFormGroup.get('single');
    const periodControl = attributeFormGroup.get('period');
    const periodTypeControl = attributeFormGroup.get('periodeTyp');
    const valueTotalControl = attributeFormGroup.get('value_total');

    singleControl?.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      console.log(value)
      if (!value) {
        periodControl?.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
        //valueTotalControl?.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
        periodTypeControl?.setValidators([Validators.required])
      } else {
        periodControl?.clearValidators();
        periodTypeControl?.clearAsyncValidators()
        //valueTotalControl?.clearValidators();
        valueTotalControl?.reset()
        periodTypeControl?.reset()
        periodControl?.reset()
        valueTotalControl?.setValue(0);
        periodTypeControl?.setValue('')
        periodControl?.setValue('')
      }
      periodControl?.updateValueAndValidity();
      valueTotalControl?.updateValueAndValidity();
      periodTypeControl?.updateValueAndValidity()

      console.log(valueTotalControl)
    });

    periodControl?.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.updateTotalValue(attributeFormGroup));
  }

  updateTotalValue(attributeFormGroup: FormGroup) {
    const valueControl = attributeFormGroup.get('value');
    const periodControl = attributeFormGroup.get('period');
    const valueTotalControl = attributeFormGroup.get('value_total');

    if (valueControl && periodControl && valueTotalControl) {
      const value = parseFloat(valueControl.value);
      const period = parseInt(periodControl.value, 10);
      if (!isNaN(value) && !isNaN(period)) {
        valueTotalControl.setValue(value * period);
      } else {
        valueTotalControl.setValue(0);
      }
    }
  }

  canDropToTariffList = (drag: any) => {
    return drag.dropContainer.id === this.tariffDropListId;
  }

  getAttributeGroupArray(): FormArray{
    return (this.tariffForm.get('attribute_groups') as FormArray);
  }

  getAttributeGroupName(index: number): string {
    const attributeGroup = this.getAttributeGroupArray().at(index) as FormGroup;
    return attributeGroup.get('name')?.value;
  }

  getAttributeFormArray(matrix: Matrix): FormArray {
    return matrix.form.get('attributes') as FormArray;
  }

  getAttributeGroupAttributes(index: number): FormArray {
    const attributeGroup = this.getAttributeGroupArray().at(index) as FormGroup;
    return attributeGroup.get('attributes') as FormArray;
  }
  
  getAttributeControl(groupIndex: number, attributeIndex: number): FormGroup {
    return this.getAttributeGroupAttributes(groupIndex).at(attributeIndex) as FormGroup;
  }

  getFormMatrixFromArray(matrix: FormArray, index: number): FormGroup {
    return matrix.at(index) as FormGroup;
  }

  removeAttribute(matrix: Matrix, attribute: Attribute, index: number) {
    //const index = //matrix.attributes.indexOf(attribute);

    if (index >= 0) {
      //const originalAttribute = this.tariffAttributes.find(attr => attr.code === attribute.code);
      const originalAttribute = this.tariffAttributes.at(index);
      if (originalAttribute) {
        originalAttribute.isCopied = false;
      }
      matrix.attributes.splice(index, 1);

      // Удаление FormControl для атрибута
      const attributes = matrix.form.get('attributes') as FormArray;
      //const formIndex = attributes.controls.findIndex(ctrl => ctrl.value.id === attribute.id);
      if (index >= 0) {
        attributes.removeAt(index);
      }
      //this.updateConnectedDropLists();
    }
  }

  updateConnectedDropLists() {
    this.connectedDropLists = [this.tariffDropListId, ...this.matrixs.map((_, i) => this.onGetMatrixDropListId(i))];
  }
  

  private loadAttributeGroups() {
      
  }

  ngOnDestroy() {
    console.log('destroy matrix')
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
