import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Attribute } from '../../../../../models/tariff/attribute/attribute';
import { FormService } from '../../../../../services/form.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { merge, Subject, takeUntil } from 'rxjs';
import { TariffService } from '../../../../../services/product/tariff/tariff.service';
import { ProductService } from '../../../../../services/product/product.service';

interface Matrix {
  id?: number | null;
  uniqueId?: string,
  name: string;
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

  editMatrixIndex: number | null = null;

  tariffDropListId = 'tariffDropList';
  connectedDropLists: string[] = [this.tariffDropListId];

  tariffForm: FormGroup
  calcMatrixForm: FormArray

  private unsubscribe$ = new Subject<void>();
  private attributeCounts = new Map<number, number>();
  private subscriptions: Map<string, any> = new Map(); // Храним подписки, чтобы легко отписываться

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

    this.subscribeToFormChanges()

    this.productService.deletedTariffAttr
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(attr => {
          console.log(attr)
          console.log(parseInt(attr))
          this.copiedAttributs.delete(attr?.id);
          console.log(this.copiedAttributs)
        })
  }

  subscribeToFormChanges() {
    const attributeGroupsControl = this.tariffForm.get('attribute_groups') as FormArray;

    if (attributeGroupsControl) {
      // Начальная подписка на изменение количества атрибутов в каждой группе
      this.subscribeToNewAttributes(attributeGroupsControl);

      // Подписка на изменение количества групп в FormArray
      attributeGroupsControl.valueChanges
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.subscribeToNewAttributes(attributeGroupsControl);
        });
    }
  }

  subscribeToNewAttributes(attributeGroupsControl: FormArray) {
    attributeGroupsControl.controls.forEach((groupControl: AbstractControl, groupIndex: number) => {
      const attributsArray = groupControl.get('attributs') as FormArray;
  
      if (!attributsArray) {
        return;
      }
  
      const currentCount = this.attributeCounts.get(groupIndex) || 0;
      console.log(attributsArray.length)
      console.log(currentCount)
      console.log(attributsArray.length < currentCount)
      if (attributsArray.length < currentCount) {
        // Отписываемся от всех удаленных атрибутов
        console.log("otpisivaemsa")
        for (let i = attributsArray.length; i < currentCount; i++) {
          const subscriptionKey = `${groupIndex}-${i}`;
          const subscription = this.subscriptions.get(subscriptionKey);
          if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(subscriptionKey);
          }
        }
      }
  
      if (attributsArray.length > currentCount) {
        console.log('test')
        for (let attributeIndex = currentCount; attributeIndex < attributsArray.length; attributeIndex++) {
          console.log('for')
          const attributeControl = attributsArray.at(attributeIndex);
          const subscriptionKey = `${groupIndex}-${attributeIndex}`;
          
          const subscription = attributeControl.valueChanges
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((value) => {
              console.log(`Изменение произошло в группе с индексом: ${groupIndex}, атрибут с индексом: ${attributeIndex}`);
              console.log(`Новое значение атрибута:`, value);
            });

          this.subscriptions.set(subscriptionKey, subscription);
        }
  
        this.attributeCounts.set(groupIndex, attributsArray.length);
        console.log( this.attributeCounts)
      }
    });
  }

  // subscribeToNewAttributes(attributeGroupsControl: FormArray) {
  //   // Перебираем все группы атрибутов
  //   attributeGroupsControl.controls.forEach((groupControl: AbstractControl, groupIndex: number) => {
  //     const attributsArray = groupControl.get('attributs') as FormArray;
  
  //     if (!attributsArray) {
  //       return;
  //     }
  
  //     // Получаем текущий сохраненный счетчик атрибутов для этой группы
  //     const currentCount = this.attributeCounts.get(groupIndex) || 0;
  
  //     // Если текущий размер массива атрибутов меньше сохраненного - атрибуты были удалены
  //     if (attributsArray.length < currentCount) {
  //       // Отписываемся от всех удаленных атрибутов
  //       console.log('otpisivaemsa')
  //       for (let i = attributsArray.length; i < currentCount; i++) {
  //         const subscriptionKey = `${groupIndex}-${i}`;
  //         const subscription = this.subscriptions.get(subscriptionKey);
  //         if (subscription) {
  //           subscription.unsubscribe();
  //           this.subscriptions.delete(subscriptionKey);
  //         }
  //       }
  //     }
  
  //     // Если новые атрибуты были добавлены, подписываемся на них
  //     if (attributsArray.length > currentCount) {
  //       for (let attributeIndex = currentCount; attributeIndex < attributsArray.length; attributeIndex++) {
  //         const attributeControl = attributsArray.at(attributeIndex);
  //         const subscriptionKey = `${groupIndex}-${attributeIndex}`;
  //         console.log('podpisivaemsa')
  //         // Подписываемся на изменения и сохраняем подписку в Map
  //         const subscription = attributeControl.valueChanges
  //           .pipe(takeUntil(this.unsubscribe$))
  //           .subscribe((value) => {
  //             console.log(`Изменение произошло в группе с индексом: ${groupIndex}, атрибут с индексом: ${attributeIndex}`);
  //             console.log(`Новое значение атрибута:`, value);
  //           });
  
  //         this.subscriptions.set(subscriptionKey, subscription);
  //       }
  //     }
  
  //     // Обновляем количество атрибутов для текущей группы в attributeCounts
  //     this.attributeCounts.set(groupIndex, attributsArray.length);
  //     console.log(this.attributeCounts)
  //     console.log(this.subscriptions)
  //   });
  // }
  

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
    this.matrixs.splice(index, 1);
    this.calcMatrixForm.removeAt(index);
    this.updateConnectedDropLists();
    this.updateTariffAttributsStatus();
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
        if(attribute?.value_varchar){
          this.addAttributeToMatrix(matrix, attribute);
          this.copiedAttributs.add(attribute.id);
        }
        
      }
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

  removeAttribute(matrix: Matrix, index: number) {
    //const index = //matrix.attributes.indexOf(attribute);

    if (index >= 0) {
      //const originalAttribute = this.tariffAttributes.find(attr => attr.code === attribute.code);
      const originalAttribute = this.tariffAttributs.at(index);
      if (originalAttribute) {
        this.copiedAttributs.delete(originalAttribute.id);
        //originalAttribute.isCopied = false;
      }
      
      matrix.attributs.splice(index, 1);

      // Удаление FormControl для атрибута
      const attributs = matrix.form.get('attributs') as FormArray;
      //const formIndex = attributes.controls.findIndex(ctrl => ctrl.value.id === attribute.id);

      attributs.removeAt(index);

      //this.updateConnectedDropLists();
    }
    this.updateTotalValueMatrix(matrix.form)
    this.updateTariffAttributsStatus();
  }

  // removeAllAtributteById(attribute: Attribute){
  //   // this.matrixs.forEach(matrix => {
  //   //   const index = matrix.attributs.findIndex(attr => attr.id == attribute.id)
  //   //   if(index >= 0){
  //   //     this.removeAttribute(matrix, index)
  //   //   }
  //   // })

  //   this.updateTariffAttributsStatus();
  // }

  updateConnectedDropLists() {
    this.connectedDropLists = [this.tariffDropListId, ...this.matrixs.map((_, i) => this.onGetMatrixDropListId(i))];
  }

  private loadTariffMatrix() {

      this.tariffService.detailedData$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => {
          if(response){
            const matrixsFromTariff = response?.data?.calc_matrix; // Здесь ваши группы из ответа сервера
            if(matrixsFromTariff){
              this.matrixs = matrixsFromTariff.map(matrix => 
              (
                {
                  id: matrix.id,
                  uniqueId: matrix.uniqueId,
                  tariff_id: matrix.tariff_id,
                  name: matrix.name,
                  total_value: matrix.total_value,
                  unit: matrix.unit,
                  attributs: matrix.attributs.map(attr => ({
                    ...attr,
                    isCopied: true // Отметьте атрибуты как скопированные
                  })),
                  hidden: false,
    
                  form: this.fb.group({
                    id: [matrix.id],
                    uniqueId: [matrix.uniqueId],
                    tariff_id: [matrix.tariff_id],
                    name: [matrix.name],
                    total_value: [matrix.total_value],
                    unit: [matrix.unit],
                    attributs: this.fb.array(

                      matrix.attributs.map(attr => {
                        return this.fb.group({
                          id: [attr.id],
                          code: [attr.code],
                          name: [attr.name],
                          period: [attr.period],
                          periodeTyp: [attr.periodeTyp],
                          single: [attr.single],
                          unit: [attr.unit],
                          value: [attr.value],
                          value_total: [attr.value_total],
                        });
                      })
                    )
                  })
                }
              ));

              this.calcMatrixForm.clear();
              this.matrixs.forEach(matrix => {
                this.calcMatrixForm.push(matrix.form);
                let attributeFormGroups = matrix.form.get('attributs') as FormArray

                attributeFormGroups.controls.forEach(attributeFormGroup => {
                  let attributForm = attributeFormGroup as FormGroup

                  const singleControl = attributForm.get('single');
                  const periodControl = attributForm.get('period');
                  const periodTypeControl = attributForm.get('periodeTyp');

                  if(!singleControl?.value){
                    periodControl?.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
                    periodTypeControl?.setValidators([Validators.required])
                  }

                  this.addFormSwitchListener(attributForm, matrix?.form);
                })
              });

              
              this.updateTariffAttributsStatus();
              this.updateConnectedDropLists();
            }
          }
        })
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
