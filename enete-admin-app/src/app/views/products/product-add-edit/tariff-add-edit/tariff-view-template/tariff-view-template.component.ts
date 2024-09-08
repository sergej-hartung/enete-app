import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from '../../../../../services/form.service';
import { TariffService } from '../../../../../services/product/tariff/tariff.service';
import { ProductService } from '../../../../../services/product/product.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tariff-view-template',
  templateUrl: './tariff-view-template.component.html',
  styleUrl: './tariff-view-template.component.scss'
})
export class TariffViewTemplateComponent {

  copiedAttributes: Set<number> = new Set(); // Хранит ID скопированных атрибутов
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

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    public tariffService: TariffService,
    private productService: ProductService,
  ){
    this.tariffForm = this.formService.getTariffForm()
    this.tpl = this.tariffForm.get('tpl') as FormArray
    this.calcMatrixForm = this.tariffForm.get('calc_matrix') as FormArray
    console.log(this.tariffForm)

  }

  ngOnInit(): void {
    this.connectedDropLists = [
      ...this.getTplForBlock(0).map((_, index) => `tplDropList-0-${index}`),
      ...this.getTplForBlock(1).map((_, index) => `tplDropList-1-${index}`),
      ...this.getTplForBlock(2).map((_, index) => `tplDropList-2-${index}`),
      this.tariffDropListId,
      this.tariffMatrixDropListId,
    ];

    this.initCollapseArrays();
  }

  initCollapseArrays(): void {
    [0, 1, 2].forEach(blockIndex => {
      const blockControls = this.getTplForBlock(blockIndex);
      this.isCollapsedArray[blockIndex] = Array(blockControls.length).fill(true);
    });
    console.log(this.isCollapsedArray)
  }

  // toggleCollapse(blockIndex: number, index: number): void {
  //   this.isCollapsedArray[blockIndex][index] = !this.isCollapsedArray[blockIndex][index];
  //   console.log(this.tariffForm)
  // }


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
        }else{
          control.get('attribute').patchValue(attribute)
        }
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
            name:        [matrix?.name],
            total_value: [matrix?.total_value],
            unit:        [matrix?.unit]
          })
        )
        }else{
          control.get('matrix').patchValue(matrix)
        }
      }
    }
    console.log(this.tariffForm)
  }

  onGetTplDropListId(index: number): string {
    return `tplDropList-${index}`;
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

  getAttributeGroupAttributes(index: number): FormArray {
    const attributeGroup = this.getAttributeGroupArray().at(index) as FormGroup;
    return attributeGroup.get('attributes') as FormArray;
  }

  // getTplForBlock(blockIndex: number): FormArray {
  //   return this.tpl.controls.filter((control) => {
  //     const position = control.get('position').value;
  //     return (blockIndex === 0 && position === 1) || 
  //            (blockIndex === 1 && position >= 2 && position <= 5) || 
  //            (blockIndex === 2 && position >= 6 && position <= 8);
  //   }) as FormArray;
  // }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  getTplForBlock(blockIndex: number) {
     //const formArray = this.fb.array([]) as FormArray;
  
    // this.tpl.controls.forEach((control) => {
    //   const position = control.get('position')?.value;
    //   if (
    //     (blockIndex === 0 && position === 1) || 
    //     (blockIndex === 1 && position >= 2 && position <= 5) || 
    //     (blockIndex === 2 && position >= 6 && position <= 8)
    //   ) {
    //     formArray.push(control);
    //   }
    // });
  
    // return formArray;
    let formArray = this.tpl.controls.filter((control) => {
      const position = control.get('position')?.value;
      return (blockIndex === 0 && position === 1) || 
             (blockIndex === 1 && position >= 2 && position <= 5) || 
             (blockIndex === 2 && position >= 6 && position <= 8);
    }) 

    //console.log(formArray)
    return formArray;
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
        autoValueSource: true,
        manualValue:     '',
        autoUnit:        true,
        manualUnit:      '',
        showUnit:        true,
        showValue:       true,
        showFieldName:   true,
        showIcon:        true,
        icon:            '',
      })
      console.log(tpl)
    }
  }

}
