import { Component } from '@angular/core';
import { FormService } from '../../../../services/form.service';
import { FormArray, FormGroup } from '@angular/forms';
import { Attribute } from '../../../../models/tariff/attribute/attribute';
import { Subject, takeUntil } from 'rxjs';
import { CalcMatrix, calcMatrixAttr, Template } from '../../../../models/tariff/tariff';

@Component({
  selector: 'app-tariff-add-edit',
  templateUrl: './tariff-add-edit.component.html',
  styleUrl: './tariff-add-edit.component.scss'
})
export class TariffAddEditComponent {

  active = 1
  tariffForm: FormGroup

  private unsubscribe$ = new Subject<void>();

  
  constructor(
    private formService: FormService
  ) {
    this.tariffForm = this.formService.getTariffForm()
  }

  ngOnInit() {
    this.subscribeToFormChanges();
  }

  subscribeToFormChanges() {
    const attributeGroupsControl = this.tariffForm.get('attribute_groups');
    const calcMatrixControl = this.tariffForm.get('calc_matrix');
  
    attributeGroupsControl?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.syncAttributesWithTemplate();
        this.syncCalcMatrix();
      });
  
    calcMatrixControl?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.syncCalcMatrix();
      });
  }

  syncCalcMatrix() {
    const calcMatrixArray = this.calcMatrixControl;
    calcMatrixArray.controls.forEach((matrix, matrixIndex) => {
      this.updateTplMatrix(matrix as FormGroup);
    });
  }

  syncAttributesWithTemplate() {
    const attributeGroups = this.attributeGroupsControl?.value;
    const calcMatrices = this.calcMatrixControl?.value;
    const templateArray = this.tplArrayControl?.value;
  
    attributeGroups.forEach((group: any) => {
      if(group?.attributes){
        group.attributes.forEach((attribute: any) => {
          this.syncAttribute(attribute, calcMatrices, templateArray);
        });
      }
    });
  }
  
  
  syncAttribute(attribute: Attribute, calcMatrices: CalcMatrix[], templateArray: Template[]) {
    this.syncAttributeWithMatrix(attribute, calcMatrices);
    this.syncAttributeWithTemplate(attribute, templateArray);
  }

  syncAttributeWithMatrix(attribute: Attribute, calcMatrices: CalcMatrix[]) {
    calcMatrices.forEach((matrix, matrixIndex) => {
      matrix.attributes.forEach((attr, attrIndex) => {
        if (this.shouldUpdateMatrixAttribute(attr, attribute)) {
          this.updateMatrixAttribute(matrixIndex, attrIndex, attribute?.value_varchar);
        }
      });
    });
  }

  shouldUpdateMatrixAttribute(attr: calcMatrixAttr, attribute: Attribute ): boolean {
    return attr.id === attribute.id && attr.value !== attribute.value_varchar;
  }

  syncAttributeWithTemplate(attribute: Attribute, templates: Template[]) {
    templates.forEach((template, templateIndex) => {
      const templateAttr = template.attribute; 
      if (templateAttr && this.shouldUpdateTemplateAttribute(templateAttr, attribute)) {
        this.updateTemplateAttribute(templateIndex, attribute);
      }
    });
  }
  

  shouldUpdateTemplateAttribute(templateAttr: Attribute, attribute: Attribute): boolean {
    return templateAttr?.id === attribute.id &&
      (templateAttr?.value_varchar !== attribute?.value_varchar || templateAttr?.value_text !== attribute?.value_text);
  }

  updateMatrixAttribute(matrixIndex: number, attrIndex: number, newValue: string | undefined) {
    const matrices = this.calcMatrixControl;
    const matrix = matrices.at(matrixIndex) as FormGroup;
    const attributes = matrix.get('attributes') as FormArray;
    attributes.at(attrIndex).patchValue({ value: newValue });

    this.updateTotalValue(attributes.at(attrIndex) as FormGroup, matrix);
    this.updateTplMatrix(matrix);
  }

  updateTplMatrix(matrix: FormGroup) {
    const tplsForm = this.tplArrayControl;
    const tpls = tplsForm?.value;

    tpls.forEach((tpl: any, tplIndex: number) => {
      if (this.isSameMatrix(tpl.matrix, matrix)) {
        const template = tplsForm.at(tplIndex) as FormGroup;
        template.get('matrix')?.patchValue(matrix.value);
      }
    });
  }

  isSameMatrix(tplMatrix: any, formMatrix: FormGroup): boolean {
    return tplMatrix?.id === formMatrix.get('id')?.value || tplMatrix?.uniqueId === formMatrix.get('uniqueId')?.value;
  }

  updateTemplateAttribute(index: number, attribute: any) {
    const tpl = this.tplArrayControl.at(index);
    tpl.get('attribute')?.patchValue(attribute);
  }

  updateTotalValue(attributeFormGroup: FormGroup, matrix: FormGroup) {
    const valueControl = attributeFormGroup.get('value');
    const periodControl = attributeFormGroup.get('period');
    const valueTotalControl = attributeFormGroup.get('value_total');

    if (valueControl && periodControl && valueTotalControl) {
      const value = parseFloat(valueControl.value.replace(',', '.'));
      const period = parseInt(periodControl.value, 10);
      valueTotalControl.setValue(!isNaN(value) && !isNaN(period) ? value * period : isNaN(value) ? 0 : value);
      this.updateTotalValueMatrix(matrix);
    }
  }

  updateTotalValueMatrix(matrix: FormGroup) {
    const attributes = matrix.get('attributes')?.value || [];
    let totalValue = 0;
    let units = new Set<string>();

    attributes.forEach((attr: any) => {
      if (attr?.unit) units.add(attr.unit);
      totalValue += parseFloat(attr?.value_total || 0);
    });

    matrix.get('unit')?.setValue(units.size === 1 ? Array.from(units)[0] : '');
    matrix.get('total_value')?.setValue(totalValue);
  }

  get attributeGroupsControl() {
    return this.tariffForm.get('attribute_groups') as FormArray;
  }

  get calcMatrixControl() {
    return this.tariffForm.get('calc_matrix') as FormArray;
  }

  get tplArrayControl(): FormArray {
    return this.tariffForm.get('tpl') as FormArray;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
