import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Attribute } from '../../../../../models/tariff/attribute/attribute';
import { FormService } from '../../../../../services/form.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { merge, Subject, takeUntil } from 'rxjs';
import { TariffService } from '../../../../../services/product/tariff/tariff.service';
import { ProductService } from '../../../../../services/product/product.service';
import { ComboStatus } from '../../../../../models/tariff/comboStatus/comboStatus';

interface Matrix {
  id?: number | null;
  uniqueId?: string,
  name: string;
  // hardware_charge: boolean,
  attributs: any[];
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

  copiedAttributs: Set<number> = new Set(); // Хранит ID скопированных атрибутов

  addNewMatrix = false;
  newMatrixForm: FormGroup;
  editMatrixForm: FormGroup;

  tariffAttributs: Attribute[] = [];
  matrixs: Matrix[] = [];
  hiddenGroups: boolean[] = [];
  //groupsу: Group[] = [];

  withHardware = false
  hardwareCharge = [
    {name: 'Hardware Zuzahlung', id:'hardwareChargeId'}
  ]
  hardwareChargeId = 'hardwareChargeId'
  editMatrixIndex: number | null = null;

  tariffDropListId = 'tariffDropList';
  connectedDropLists: string[] = [this.tariffDropListId, this.hardwareChargeId];

  tariffForm: FormGroup
  calcMatrixForm: FormArray

  private unsubscribe$ = new Subject<void>();

  private subscriptions: Map<number, any> = new Map(); // Храним подписки, чтобы легко отписываться

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    public tariffService: TariffService,
    private productService: ProductService,
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
    this.productService.productMode$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(mode => {
          if(mode == 'edit')  this.loadTariffMatrix();
        })


    this.productService.deletedTariffAttr
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(attr => {
          this.removeAllAtributteById(attr)
          this.unsubscribeToFormCanges(attr.id)
        })

    this.productService.deletedTariffAttrGroup
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(group => {
          if(group && 'attributs' in group){
            group.attributs.forEach((attr: any) => {
              this.removeAllAtributteById(attr)
              this.unsubscribeToFormCanges(attr.id)
            })
          }
        })
    this.productService.loadedTarif$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(state =>{
        if(state.tariff){
          this.comboStatus.valueChanges
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(combos => {
            
            const comboStatusHardware = combos.find((item: ComboStatus) => item.id == 2)
              if(comboStatusHardware){
                if(comboStatusHardware?.checked){
                  console.log(combos)
                  this.withHardware = true
                }else if(!comboStatusHardware?.checked){
                  console.log(combos)
                  this.withHardware = false
                  this.matrixs.forEach(matrix => {
                    this.removeHardwareCharge(matrix)
                  })
                  console.log(this.matrixs)
                }
                
              }
          })
        }
        console.log(state.tariff)
      })
    
  }

  

  onSaveNewMatrix(){
    if (this.newMatrixForm.valid) {
      const newMatrix: Matrix = {
        name: this.newMatrixForm.value.name,
        attributs: [],
        form: this.fb.group({
          id: [null],
          uniqueId: [this.generateUniqueIdWithTimestamp()],
          name: [this.newMatrixForm.value.name],
          total_value: 0,
          hardware_charge: false,
          unit: [''],
          attributs: this.fb.array([])
        })
      };
      this.matrixs.push(newMatrix);
      this.calcMatrixForm.push(newMatrix.form);
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
    this.productService.deletedTariffMatrix.emit(this.matrixs.at(index));
    this.matrixs.splice(index, 1);
    this.calcMatrixForm.removeAt(index);
    this.updateConnectedDropLists();
    this.updateTariffAttributsStatus();
  }

  onGetMatrixDropListId(index: number): string {
    return `matrixDropList-${index}`;
  }

  onAddNewMatrix(){
    this.addNewMatrix = true;
    this.newMatrixForm.reset();
  }


  drop(event: CdkDragDrop<any[]>, matrix?: Matrix) {
    console.log(event)
    if (event.previousContainer === event.container && matrix) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.moveAttributeInFormArray(matrix, event.previousIndex, event.currentIndex);
    } else {
      const attribute = event.previousContainer.data[event.previousIndex];
      console.log(attribute)
      console.log(matrix)
      if (matrix) {
        if(attribute?.value_varchar){
          this.addAttributeToMatrix(matrix, attribute);
          this.subscribeToFormChanges(attribute.id)
          this.copiedAttributs.add(attribute.id);
        }
        
        if(attribute?.id && attribute?.id === "hardwareChargeId"){
          //this.matrixs.hardware_charge = true
          const hardwareCharge = matrix?.form.get('hardware_charge')
          hardwareCharge?.setValue(true)
          console.log(matrix?.form.get('hardware_charge'))
        }
      }
    }
  }

  unsubscribeToFormCanges(id: number){
    if(this.subscriptions.has(id)){
      const subscription = this.subscriptions.get(id);
      if (subscription) {
        subscription.unsubscribe();
        this.subscriptions.delete(id);
      }
    }
    
  }

  subscribeToFormChanges(id: number){
    if(!this.subscriptions.has(id)){
      let tariffForm = this.getAttributeGroupArray()
      
      tariffForm.controls.forEach((formGroup) => {
        const attributs = formGroup.value?.attributs || [];

        const attrIndex = attributs.findIndex((attribute: any) => attribute.id === id);

        if (attrIndex > -1) {

          const attributsArr = formGroup.get('attributs') as FormArray
          const attrControl = attributsArr?.at(attrIndex)
          if(attrControl){
            
              const subscription = attrControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(attr => {
                this.updateValueMatrix(attr)
              })
              this.subscriptions.set(id, subscription);
          }
        }
      });
    }
  }

  moveAttributeInFormArray(matrix: Matrix, previousIndex: number, currentIndex: number) {
    const attributsFormArray = matrix.form.get('attributs') as FormArray;
    const attribute = attributsFormArray.at(previousIndex);
    attributsFormArray.removeAt(previousIndex);
    attributsFormArray.insert(currentIndex, attribute);
  }

  addAttributeToMatrix(matrix: Matrix, attribute: any) {

      matrix.attributs.push(attribute);
      const attributsFormArray = matrix.form.get('attributs') as FormArray;
      const attributeFormGroup = this.fb.group({
        id: [attribute.id],
        code: [attribute.code],
        name: [attribute.name],
        value: [attribute.value_varchar],
        value_total: [parseFloat(attribute.value_varchar.replace(',', '.'))],
        unit: [attribute.unit],
        single: [true],
        period: [''],
        periodeTyp: ['']
      });
  
      attributsFormArray.push(attributeFormGroup);
  
      this.addFormSwitchListener(attributeFormGroup, matrix?.form);
      this.updateTotalValueMatrix(matrix?.form)
  }

  addFormSwitchListener(attributeFormGroup: FormGroup, matrixGroup: FormGroup) {
    const singleControl = attributeFormGroup.get('single');
    const periodControl = attributeFormGroup.get('period');
    const periodTypeControl = attributeFormGroup.get('periodeTyp');
    const valueTotalControl = attributeFormGroup.get('value_total');

    singleControl?.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      if (!value) {
        periodControl?.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
        periodTypeControl?.setValidators([Validators.required])
      } else {
        periodControl?.clearValidators();
        periodTypeControl?.clearAsyncValidators()
        valueTotalControl?.reset(0, { emitEvent: false })
        periodTypeControl?.reset('', { emitEvent: false })
        periodControl?.reset('', { emitEvent: false })
      }
      periodControl?.updateValueAndValidity();
      valueTotalControl?.updateValueAndValidity();
      periodTypeControl?.updateValueAndValidity()
    });

    periodControl?.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.updateTotalValue(attributeFormGroup, matrixGroup));
  }

  updateValueMatrix(attr: any){
    this.matrixs.forEach(matrix => {
      let matrixAttribut = matrix?.attributs?.find(matrixAttr => matrixAttr.id == attr.id)
      let matrixAttributsForm = matrix?.form?.get('attributs') as FormArray
      let matrixAttributsFormVal = matrixAttributsForm?.value
      let matrixAttrIndex = matrixAttributsFormVal.findIndex((matrixAttr: any) => matrixAttr.id == attr.id)
      let mattrixAttrForm = matrixAttrIndex > -1 ? matrixAttributsForm?.at(matrixAttrIndex) as FormGroup : false

      if(matrixAttribut && mattrixAttrForm){
        matrixAttribut.value_varchar = attr.value_varchar
        mattrixAttrForm.patchValue({value: attr.value_varchar})
        this.updateTotalValue(mattrixAttrForm, matrix?.form)
      }
    })
  }

  updateTotalValue(attributeFormGroup: FormGroup, matrixGroup: FormGroup) {
    const valueControl = attributeFormGroup.get('value');
    const periodControl = attributeFormGroup.get('period');
    const valueTotalControl = attributeFormGroup.get('value_total');

    if (valueControl && periodControl && valueTotalControl) {
      const value = parseFloat(valueControl.value.replace(',', '.'));
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
      this.updateTotalValueMatrix(matrixGroup)
    }
  }



  updateTotalValueMatrix(matrix: any){
    if(matrix){
      const Attributs = matrix?.value?.attributs 
      let MatrixTotalValue = 0
      let unitSet = new Set<string>();

      if(Attributs){
        Attributs.forEach((attr:any) => {
          if (attr?.unit !== undefined) {
              unitSet.add(attr.unit);
          }
          if(attr?.value_total !== undefined){
            MatrixTotalValue += parseFloat(attr?.value_total)
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

  

  canDropToTariffList = (drag: any) => {
    return drag.dropContainer.id === this.tariffDropListId;
  }

  getAttributeGroupArray(): FormArray{
    return (this.tariffForm.get('attribute_groups') as FormArray);
  }

  get comboStatus(): FormArray {
    return this.tariffForm.get('combo_status') as FormArray;
  }

  getAttributeGroupName(index: number): string {
    const attributeGroup = this.getAttributeGroupArray().at(index) as FormGroup;
    return attributeGroup.get('name')?.value;
  }

  getAttributeFormArray(matrix: Matrix): FormArray {
    return matrix.form.get('attributs') as FormArray;
  }

  getAttributeGroupAttributs(index: number): FormArray {
    const attributeGroup = this.getAttributeGroupArray().at(index) as FormGroup;
    return attributeGroup.get('attributs') as FormArray;
  }
  
  getAttributeControl(groupIndex: number, attributeIndex: number): FormGroup {
    return this.getAttributeGroupAttributs(groupIndex).at(attributeIndex) as FormGroup;
  }

  getAttributControl(controll:any){
    return controll as FormGroup
  }

  getFormMatrixFromArray(matrixs:any, index: number): FormGroup {
    return matrixs.at(index).form as FormGroup;
  }

  getTotalValueMatrix(matrixs: any, MatrixIndex:number){
    const matrix = this.getFormMatrixFromArray(matrixs, MatrixIndex)
    if(matrix){
      const totalValue = matrix.get('total_value')?.value
      if(totalValue !== undefined) return totalValue
    } 
    return 0
  }

  getUnitMatrix(matrixs: any, MatrixIndex:number){
    const matrix = this.getFormMatrixFromArray(matrixs, MatrixIndex)
    if(matrix){
      const unit = matrix.get('unit')?.value
      if(unit !== undefined) return unit
    } 
    return ''
  }

  getHardwareChargematrix(matrix: Matrix){
    if(matrix){
      const hardwareCharge = matrix?.form.get('hardware_charge')
      if(hardwareCharge){
        return hardwareCharge.value
      }else{
        return false
      }
    }
    return false
  }

  removeHardwareCharge(matrix: Matrix){
    if(matrix){
      const hardwareCharge = matrix?.form.get('hardware_charge')
      hardwareCharge?.setValue(false)
    }
  }

  removeAttribute(matrix: Matrix, index: number) {
    //const index = //matrix.attributes.indexOf(attribute);

    if (index >= 0) {
      const originalAttribute = this.tariffAttributs.at(index);
      if (originalAttribute) {
        this.copiedAttributs.delete(originalAttribute.id);
      }
      
      matrix.attributs.splice(index, 1);

      // Удаление FormControl для атрибута
      const attributs = matrix.form.get('attributs') as FormArray;

      attributs.removeAt(index);
    }
    this.updateTotalValueMatrix(matrix.form)
    this.updateTariffAttributsStatus();
  }

  removeAllAtributteById(attribute: Attribute){
    this.matrixs.forEach(matrix => {
      const index = matrix.attributs.findIndex(attr => attr.id == attribute.id)
      if(index >= 0){
        this.removeAttribute(matrix, index)
      }
    })
  }

  updateConnectedDropLists() {
    this.connectedDropLists = [this.tariffDropListId, ...this.matrixs.map((_, i) => this.onGetMatrixDropListId(i))];
  }

  private loadTariffMatrix() {
    this.tariffService.detailedData$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
          if(response && response.data && response.data.combo_status){
            const comboStatus = response.data.combo_status
            const hardwareCombo = comboStatus.find(item => item?.id == 2)
            if(hardwareCombo){
              this.withHardware = true
            }
          }
          if (response && response.data && response.data.calc_matrix) {
              // Очищаем текущую матрицу и формы
              this.matrixs = [];
              this.calcMatrixForm.clear();

              const CALC_MATRIX = JSON.parse(JSON.stringify(response.data.calc_matrix))
              // Проходимся по каждой матрице в ответе
              CALC_MATRIX.forEach((matrixData: any) => {

                  const attributs = matrixData.attributs.map((attr: Attribute) => this.createAttributeForm(attr))
                  const copiedAttributes = JSON.parse(JSON.stringify(matrixData.attributs))
                  // Создаем форму для матрицы
                  const matrixForm = this.fb.group({
                      id: [matrixData.id || null],
                      uniqueId: [matrixData.uniqueId || this.generateUniqueIdWithTimestamp()],
                      name: [matrixData.name, Validators.required],
                      total_value: [matrixData.total_value || 0],
                      unit: [matrixData.unit || ''],
                      hardware_charge: [matrixData.hardware_charge || ''],
                      attributs: this.fb.array(attributs)
                  });
                  // Добавляем подписки на изменения атрибутов
                  const attributsFormArray = matrixForm.get('attributs') as FormArray;
                  attributsFormArray.controls.forEach(attrForm => {
                      if (attrForm instanceof FormGroup) {
                          this.addFormSwitchListener(attrForm, matrixForm);
                      }
                  });

                  // Добавляем матрицу в список
                  this.matrixs.push({
                      id: matrixData.id,
                      uniqueId: matrixData.uniqueId,
                      name: matrixData.name,
                      attributs: copiedAttributes,
                      form: matrixForm
                  });

                  // Добавляем форму матрицы в FormArray
                  this.calcMatrixForm.push(matrixForm);
              });

              // Обновляем списки для драг-н-дропа
              this.updateTariffAttributsStatus();
              this.updateConnectedDropLists();

              this.productService.updateTariffLoadedState('calcMatrix', true);
          }
      });
  }

  private createAttributeForm(attribute: any): FormGroup {
    this.subscribeToFormChanges(attribute.id)
    return this.fb.group({
        id: [attribute.id],
        code: [attribute.code],
        name: [attribute.name],
        value: [attribute.value || ''],
        value_total: [attribute.value_total || 0],
        unit: [attribute.unit || ''],
        single: [!!attribute.single],
        period: [attribute.period || ''],
        periodeTyp: [attribute.periodeTyp || '']
    });
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
  
  private updateTariffAttributsStatus() {
    this.copiedAttributs = new Set(this.matrixs.flatMap(matrix => matrix.attributs.map(attr => attr.id)));
  }

  private generateUniqueIdWithTimestamp(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
