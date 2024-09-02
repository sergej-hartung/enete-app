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

  tariffForm: FormGroup

  tariffDropListId = 'tariffDropList';
  connectedDropLists: string[] = [this.tariffDropListId];

  hiddenGroups: boolean[] = [];

  isCollapsed = true;

  tpl: any[] = [
    {
      'id': 1,
      'fildNameAsAttrName': true,
      'customFildName': '',
      'attrValue': true,
      'customValue': '',
      'unitVisible' : true,
      'valueVisible': true,
      'fildNameVisible': true,
      'position': 1,
      'icon': '',
      'attribut': {
        'id': 10,
        'value': '15',
        // 'code': "regulaerer_basispreis",
        // 'input_type': "Dezimalzahlen",
        // 'input_type_id': 3,
        'is_frontend_visible':  1,
        // 'is_required': 1,
        // 'is_system': 0,
        'name': "Regulärer Basispreis",
        'unit': "EUR"
      }
    }
  ]

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    public tariffService: TariffService,
    private productService: ProductService,
  ){
    this.tariffForm = this.formService.getTariffForm()
  }



  drop(event: CdkDragDrop<any[]>) {
    console.log(event)
    // if (event.previousContainer === event.container && matrix) {
    //   moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    //   this.moveAttributeInFormArray(matrix, event.previousIndex, event.currentIndex);
    // } else {
    //   const attribute = event.previousContainer.data[event.previousIndex];
    //   if (matrix) {
    //     // Проверяем, существует ли атрибут с таким же id в целевой матрице
    //     // const attributeExists = matrix.attributes.some(attr => attr.id === attribute.id);
    //     // if (!attributeExists) {
    //     //   this.addAttributeToMatrix(matrix, attribute);
    //     // }

    //     console.log(attribute)
    //     if(attribute?.value_varchar){
    //       this.addAttributeToMatrix(matrix, attribute);
          
    //       attribute.isCopied = true;
    //     }
        
    //   }
    // }
    // console.log(this.tariffForm)
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

}
