import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from '../../../../../services/form.service';
import { TariffService } from '../../../../../services/product/tariff/tariff.service';
import { ProductService } from '../../../../../services/product/product.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Subject, takeUntil } from 'rxjs';
import { Template, TemplateResult } from '../../../../../models/tariff/tariff';

@Component({
  selector: 'app-tariff-view-template',
  templateUrl: './tariff-view-template.component.html',
  styleUrl: './tariff-view-template.component.scss'
})
export class TariffViewTemplateComponent {

  copiedAttributs: Set<number> = new Set(); // Хранит ID скопированных атрибутов
  tariffForm: FormGroup

  tariffDropListId = 'tariffDropList';
  tariffMatrixDropListId = 'tariffMatrixDropList';
  connectedDropLists: string[] = [];

  hiddenGroups: boolean[] = [];
  hiddenMatrices: boolean = false;
  isCollapsedArray: boolean[][] = [[], [], []];
  //isCollapsed = true;

  tpl: FormArray
  calcMatrixForm: FormArray

  private unsubscribe$ = new Subject<void>();
  private subscriptions: Map<number|string, any> = new Map();

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    public tariffService: TariffService,
    private productService: ProductService,
  ){
    this.tariffForm = this.formService.getTariffForm()
    this.tpl = this.tariffForm.get('tpl') as FormArray
    this.calcMatrixForm = this.tariffForm.get('calc_matrix') as FormArray

  }

  ngOnInit(): void {

    this.productService.productMode$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(mode => {
          if(mode == 'edit')  this.loadTpl();
        })

    this.updateConnectedDropLists()

    this.initCollapseArrays();

    // Delete Tariff Attribut Group
    this.productService.deletedTariffAttr
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(attr => {
          const tpl = this.getTplByAttrId(attr.id)

          if(tpl){
            this.deleteTpl(tpl)
            this.unsubscribeToFormCanges(attr.id)
          }
        })

    // Delete Tariff Group
    this.productService.deletedTariffAttrGroup
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(group => {
          if(group && 'attributs' in group){
            group.attributs.forEach((attr: any) => {
              const tpl = this.getTplByAttrId(attr.id)
              if(tpl){
                this.deleteTpl(tpl)
                this.unsubscribeToFormCanges(attr.id)
              }
            })
          }
        })

    this.productService.deletedTariffMatrix
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(matrixObj => {
          const matrix = matrixObj?.form.value
          if(matrix && matrix.id){
            const tpl = this.getTplByMatrixId(matrix.id)
            if(tpl){
              this.deleteTpl(tpl)
              this.unsubscribeToFormCanges(matrix.id)
            }
          }else if(matrix && matrix.uniqueId){
            const tpl = this.getTmlByMatrixUniqueId(matrix.uniqueId)
            if(tpl){
              this.deleteTpl(tpl)
              this.unsubscribeToFormCanges(matrix.uniqueId)
            }
          }
        })
  }

  private loadTpl() {
    this.tariffService.detailedData$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => {
            if (response && response.data && response.data.tpl) {
                // this.tpl.clear();
                response.data.tpl.forEach((tplItem: any) => {
                  const index = this.tpl.controls.findIndex(
                    control => control.get('position')?.value === tplItem.position
                  );

                  if (index > -1) {
                    const tplControl = this.tpl.at(index) as FormGroup;
                    this.resetTplForm(tplControl)
                    this.setTplForm(tplControl, tplItem)
                  }
                });
                this.updateConnectedDropLists();
                this.productService.updateTariffLoadedState('tpl', true);
            }
        });
  }

  private setTplForm(tplControl: FormGroup, tplItem: TemplateResult) {
    tplControl.patchValue({
      id: tplItem.id || null,
      customFild:       tplItem.custom_field,
      isMatrix:         tplItem.is_matrix,
      isHtml:           tplItem.is_html,
      autoFieldName:    tplItem.auto_field_name,
      manualFieldName:  tplItem.manual_field_name,
      autoValueSource:  tplItem.auto_value_source,
      manualValue:      tplItem.manual_value,
      manualValueHtml:  tplItem.manual_value_html,
      autoUnit:         tplItem.auto_unit,
      manualUnit:       tplItem.manual_unit,
      showUnit:         tplItem.show_unit,
      showValue:       tplItem.show_value,
      showFieldName:    tplItem.show_field_name,
      showIcon:         tplItem.show_icon,
      //position:         [pos, [Validators.pattern('^[0-9]+$')]],
      icon:             tplItem.icon,
    })

    // Динамически добавляем контролы, если данные есть
    if (tplItem.attribute) {
        this.addAttributeControl(tplControl, tplItem.attribute);
    }

    if (tplItem.matrix) {
        this.addMatrixControl(tplControl, tplItem.matrix);
    }

    //return form;
  }

  private addAttributeControl(form: FormGroup, attribute: any): void {
    if (!form.contains('attribute')) {
        form.addControl(
            'attribute',
            this.fb.group({
                id: [attribute?.id || null],
                name: [attribute?.name || ''],
                code: [attribute?.code || ''],
                is_active: [attribute?.is_active || false],
                value_text: [attribute?.value_text || null],
                value_varchar: [attribute?.value_varchar || null],
                unit: [attribute?.unit || null]
            })
        );

        this.copiedAttributs.add(attribute.id);
    }else{
      this.copiedAttributs.add(attribute.id);
      form?.get('attribute')?.patchValue(attribute)
    }

    this.subscribeToFormChanges(attribute?.id, form)
  }

  private addMatrixControl(form: FormGroup, matrix: any): void {
    if (!form.contains('matrix')) {
        form.addControl(
            'matrix',
            this.fb.group({
                id: [matrix?.id || null],
                uniqueId: [matrix?.uniqueId || ''],
                name: [matrix?.name || ''],
                total_value: [matrix?.total_value || 0],
                unit: [matrix?.unit || '']
            })
        );
    }else{
      form?.get('matrix')?.patchValue(matrix)
    }

    this.subscribeToMatrixChanges(matrix?.uniqueId, form)
  }

  private removeControlIfExists(form: FormGroup, controlName: string): void {
    if (form.contains(controlName)) {
        form.removeControl(controlName);
    }
  }

  private updateConnectedDropLists() {
    this.connectedDropLists = [
      ...this.getTplForBlock(0).map((_, index) => `tplDropList-0-${index}`),
      ...this.getTplForBlock(1).map((_, index) => `tplDropList-1-${index}`),
      ...this.getTplForBlock(2).map((_, index) => `tplDropList-2-${index}`),
      this.tariffDropListId,
      this.tariffMatrixDropListId,
    ];
  }

  initCollapseArrays(): void {
    [0, 1, 2].forEach(blockIndex => {
      const blockControls = this.getTplForBlock(blockIndex);
      this.isCollapsedArray[blockIndex] = Array(blockControls.length).fill(true);
    });
  }

  drop(event: CdkDragDrop<any[]>, control?: any) {
    if (event.previousContainer.id === this.tariffDropListId){
      const attribute = event.previousContainer.data[event.previousIndex];
      
      if(control){
        this.resetTplForm(control)
        if (!control.contains('attribute')){
          control.addControl('attribute', this.fb.group({
              id:            [attribute?.id],
              name:          [attribute?.name],
              code:          [attribute?.code],
              is_active:     [attribute?.is_active],
              value_text:    [attribute?.value_text],
              value_varchar: [attribute?.value_varchar],
              unit:          [attribute?.unit]
            })
          )
          this.copiedAttributs.add(attribute.id);
        }else{
          this.copiedAttributs.add(attribute.id);
          control.get('attribute').patchValue(attribute)
        }

        this.subscribeToFormChanges(attribute?.id, control)
      }
    }
    if(event.previousContainer.id === this.tariffMatrixDropListId){
      const matrix = event.previousContainer.data[event.previousIndex];
      if(control){
        this.resetTplForm(control)
        control.patchValue({isMatrix: true})
        
        if (!control.contains('matrix')){
          control.addControl('matrix', this.fb.group({
            id:          [matrix?.id],
            uniqueId:    [matrix?.uniqueId],
            name:        [matrix?.name],
            total_value: [matrix?.total_value],
            unit:        [matrix?.unit]
          })
        )
        }else{
          control.get('matrix').patchValue(matrix)
        }

        this.subscribeToMatrixChanges(matrix?.uniqueId, control)
      }
    }
  }

  subscribeToFormChanges(id: number, control: FormGroup){
    if(id && !this.subscriptions.has(id)){
      let tariffForm = this.getAttributeGroupArray()
      
      tariffForm.controls.forEach((formGroup) => {
        const attributs = formGroup.value?.attributs || [];

        const attrIndex = attributs.findIndex((attribute: any) => attribute.id === id);

        if (attrIndex > -1) {

          const attributsArr = formGroup.get('attributs') as FormArray
          const attrControl = attributsArr?.at(attrIndex)
          if(attrControl){
            
              const subscription = attrControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(attr => {
                control.get('attribute')?.patchValue(attr)
              })
              this.subscriptions.set(id, subscription);
          }
        }
      });
    }
  }

  subscribeToMatrixChanges(uniqueId: string, control: FormGroup){
    if(uniqueId && !this.subscriptions.has(uniqueId)){
      const matrices = this.calcMatrixForm.value

      const matrixIndex = matrices.findIndex((matrix: any) => matrix.uniqueId == uniqueId)
      if(matrixIndex > -1){
        const matrixControl = this.calcMatrixForm.at(matrixIndex)

        const subscription = matrixControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(matrix => {
          //control.patchValue(attr)
          control.get('matrix')?.patchValue(matrix)
        })
        this.subscriptions.set(uniqueId, subscription);
      }
      
    }
  }

  onGetTplDropListId(index: number): string {
    return `tplDropList-${index}`;
  }

  getTplByMatrixId(id: number){
    const tpl = this.tpl.controls.find(control => {
      const controlVal = control.value
      if("matrix" in controlVal){
        if(id == controlVal.matrix.id){
          return true
        }
      }
      return false
    })

    return tpl
  }

  getTmlByMatrixUniqueId(uniqueId: string){
    const tpl = this.tpl.controls.find(control => {
      const controlVal = control.value
      if("matrix" in controlVal){
        if(uniqueId == controlVal.matrix.uniqueId){
          return true
        }
      }
      return false
    })

    return tpl
  }

  getTplByAttrId(id: number){
    const tpl = this.tpl.controls.find(control => {
      const controlVal = control.value
      if("attribute" in controlVal){
        if(id == controlVal.attribute.id){
          return true
        }
      }
      return false
    })

    return tpl
  }

  canDropToTariffList = (drag: any) => {
    return drag.dropContainer.id === this.tariffDropListId;
  }

  onToggleGroupVisibility(index: number) {
    this.hiddenGroups[index] = !this.hiddenGroups[index];
  }

  onToggleMatrices(){
    this.hiddenMatrices = !this.hiddenMatrices
  }

  getAttributeGroupArray(): FormArray{
    return (this.tariffForm.get('attribute_groups') as FormArray);
  }

  getAttributeGroupName(index: number): string {
    const attributeGroup = this.getAttributeGroupArray().at(index) as FormGroup;
    return attributeGroup.get('name')?.value;
  }

  getAttributeGroupAttributs(index: number): FormArray {
    const attributeGroup = this.getAttributeGroupArray().at(index) as FormGroup;
    return attributeGroup.get('attributs') as FormArray;
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  getTplForBlock(blockIndex: number) {
    // return formArray;
    let formArray = this.tpl.controls.filter((control) => {
      const position = control.get('position')?.value;
      return (blockIndex === 0 && position === 1) || 
             (blockIndex === 1 && position >= 2 && position <= 5) || 
             (blockIndex === 2 && position >= 6 && position <= 8);
    }) 

    return formArray;
  }

  deleteTpl(tpl: any){
    this.resetTplForm(tpl)
    this.updateTariffAttributsStatus()
  }

  private updateTariffAttributsStatus() {
    const ids = this.tpl?.value.reduce((acc: number[], t: any) => {
      if (t?.attribute?.id) {
        acc.push(t.attribute.id);  // Если id существует, добавляем его в массив
      }
      return acc;
    }, []);
    this.copiedAttributs = new Set(ids);
  }

  unsubscribeToFormCanges(id: string | number){
    if(this.subscriptions.has(id)){
      const subscription = this.subscriptions.get(id);
      if (subscription) {
        subscription.unsubscribe();
        this.subscriptions.delete(id);
      }
    }
    
  }

  resetTplForm(tpl:any){
    if(tpl){
      tpl.removeControl('attribute')
      tpl.removeControl('matrix')
      tpl.patchValue({              
        customFild:      false,
        isMatrix:        false,
        autoFieldName:   true, 
        manualFieldName: '' ,
        isHtml:          false, 
        autoValueSource: true,
        manualValue:     '',  
        manualValueHTML: '',  
        autoUnit:        true,
        manualUnit:      '',  
        showUnit:        true,
        showValue:       true,
        showFieldName:   true,
        showIcon:        true,
        icon:            '',
      })
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
