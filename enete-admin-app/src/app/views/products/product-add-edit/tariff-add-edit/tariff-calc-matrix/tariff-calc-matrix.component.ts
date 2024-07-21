import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Attribute } from '../../../../../models/tariff/attribute/attribute';
import { FormService } from '../../../../../services/form.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

interface Matrix {
  id?: number;
  name: string;
  attributes: Attribute[];
  form: FormGroup; // Убедимся, что form всегда определяется как FormGroup
  hidden?: boolean;
}

interface Group {
  id?: number;
  name: string;
  attributes: Attribute[];
  form: FormGroup; // Убедимся, что form всегда определяется как FormGroup
  hidden?: boolean;
}

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
  groups: Group[] = [];

  editMatrixIndex: number | null = null;

  tariffDropListId = 'tariffDropList';
  connectedDropLists: string[] = [this.tariffDropListId];

  calcMatrixForm: FormArray

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
  ){
    const tariffForm = this.formService.getTariffForm()
    this.calcMatrixForm = tariffForm.get('calc_matrix') as FormArray

    this.newMatrixForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.editMatrixForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    console.log('load matrix')
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

  }

  onCancelEditGroup() {
    this.editMatrixIndex = null;
    this.editMatrixForm.reset();
  }

  onToggleMatrixs(index: number) {
    this.matrixs[index].hidden = !this.matrixs[index].hidden;
  }

  onEditMatrix(index: number) {
    this.editMatrixIndex = index;
    this.editMatrixForm.setValue({ name: this.matrixs[index].name });
  }

  onRemoveMatrix(index: number) {
    this.matrixs.splice(index, 1);
    this.calcMatrixForm.removeAt(index);
    //this.updateConnectedDropLists();
    //this.updateTariffAttributesStatus(); // Обновление статуса после удаления группы
  }

  onGetMatrixDropListId(index: number): string {
    return `matrixDropList-${index}`;
  }

  onAddNewMatrix(){
    this.addNewMatrix = true;
    this.newMatrixForm.reset();
  }

  drop(event: CdkDragDrop<any[]>, matrix?: Matrix){
    
  }

  canDropToTariffList = (drag: any) => {
    return drag.dropContainer.id === this.tariffDropListId;
  }

  getAttributeFormArray(matrix: Matrix): FormArray {
    return matrix.form.get('attributes') as FormArray;
  }

  getFormMatrixFromArray(matrix: FormArray, index: number): FormGroup {
    return matrix.at(index) as FormGroup;
  }

  removeAttribute(matrix: Matrix, attribute: Attribute) {
    const index = matrix.attributes.indexOf(attribute);
    if (index >= 0) {
      const originalAttribute = this.tariffAttributes.find(attr => attr.code === attribute.code);
      if (originalAttribute) {
        originalAttribute.isCopied = false;
      }
      matrix.attributes.splice(index, 1);

      // Удаление FormControl для атрибута
      const attributes = matrix.form.get('attributes') as FormArray;
      const formIndex = attributes.controls.findIndex(ctrl => ctrl.value.id === attribute.id);
      if (formIndex >= 0) {
        attributes.removeAt(formIndex);
      }
    }
  }

  private loadAttributeGroups() {
      
  }

  ngOnDestroy() {
    console.log('destroy matrix')
  }
}
