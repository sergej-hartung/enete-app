import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../../../../services/form.service';
import { TariffService } from '../../../../../services/product/tariff/tariff.service';

@Component({
  selector: 'app-tariff-promo',
  templateUrl: './tariff-promo.component.html',
  styleUrl: './tariff-promo.component.scss'
})
export class TariffPromoComponent {

  addNewPromo = false
  newPromosForm: FormGroup;
  editPromosForm: FormGroup;

  tariffForm: FormGroup
  promosForm: FormArray

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    public tariffService: TariffService,
    //private productService: ProductService,
  ){
    this.tariffForm = this.formService.getTariffForm()
    this.promosForm = this.tariffForm.get('promos') as FormArray

    this.newPromosForm = this.fb.group({
      title: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      is_active: [true],
      text_long: ['']
    });

    this.editPromosForm = this.fb.group({
      title: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      is_active: [true],
      text_long: ['']
    });
  }

  onAddNewPromo(){
    console.log('test')
    this.addNewPromo = true
    this.newPromosForm.reset();
  }

  onSaveNewPromo(){

  }

  onCancelNewPromo(){
    this.addNewPromo = false
    this.newPromosForm.reset()
  }


  // onSaveNewMatrix(){
  //   if (this.newMatrixForm.valid) {
  //     const newMatrix: Matrix = {
  //       name: this.newMatrixForm.value.name,
  //       attributes: [],
  //       form: this.fb.group({
  //         id: [null],
  //         name: [this.newMatrixForm.value.name],
  //         total_value: 0,
  //         unit: [''],
  //         attributes: this.fb.array([])
  //       })
  //     };
  //     this.matrixs.push(newMatrix);
  //     this.calcMatrixForm.push(newMatrix.form);
  //     console.log(this.matrixs)
  //     this.updateConnectedDropLists()
  //     //this.updateConnectedDropLists();
  //     this.addNewMatrix = false;
  //     this.newMatrixForm.reset();
  //   }
  // }
}
