import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../../../../services/form.service';
import { TariffService } from '../../../../../services/product/tariff/tariff.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EditorModalComponent } from '../../../../../shared/components/editor-modal/editor-modal.component'
import { Subject, takeUntil } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-tariff-promo',
  templateUrl: './tariff-promo.component.html',
  styleUrl: './tariff-promo.component.scss'
})
export class TariffPromoComponent {

  addNewPromo = false
  newPromoForm: FormGroup;
  editPromoForm: FormGroup;
  editPromoIndex: number | null = null

  tariffForm: FormGroup
  promosForm: FormArray


  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    public tariffService: TariffService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    //private productService: ProductService,
  ){
    this.tariffForm = this.formService.getTariffForm()
    this.promosForm = this.tariffForm.get('promos') as FormArray

    this.newPromoForm = this.fb.group({
      title: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      is_active: [true],
      text_long: ['']
    });

    this.editPromoForm = this.fb.group({
      title: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });
  }

  onAddNewPromo(){
    this.addNewPromo = true
    this.newPromoForm.reset();
  }

  onSaveNewPromo(){
    if(this.newPromoForm.valid){
      this.promosForm.push(
        this.fb.group({
          id: [null],
          title: [this.newPromoForm?.value?.title, Validators.required],
          start_date: [this.newPromoForm?.value?.start_date, Validators.required],
          end_date: [this.newPromoForm?.value?.end_date, Validators.required], 
          is_active: [true, Validators.required],
          text_long: this.newPromoForm?.value?.text_long
        })
      )

      this.addNewPromo = false
      this.newPromoForm.reset()
    }
  }

  onEditPromo(index: number){
    this.editPromoIndex = index;
    this.editPromoForm.setValue(
      { 
          title: this.promosForm.at(index)?.value?.title,
          start_date: this.promosForm.at(index)?.value?.start_date,
          end_date: this.promosForm.at(index)?.value?.end_date,
          //text_long: this.promosForm.at(index)?.value?.text_long
      }
    );
  }

  onSaveEditPromo(){
    if(this.editPromoForm.valid && this.editPromoIndex !== null){

      const promoForm = this.promosForm.at(this.editPromoIndex) as FormGroup;
      promoForm.patchValue(this.editPromoForm.value)

      this.editPromoIndex = null
      this.editPromoForm.reset()
    }
  }

  onCancelNewPromo(){
    this.addNewPromo = false
    this.newPromoForm.reset()
  }

  onCancelEditPromo(){
    this.editPromoIndex = null;
    this.editPromoForm.reset();
  }

  onTooglePromoVisible(index: number){
    const isActive = this.promosForm.at(index)?.value?.is_active
    this.promosForm.at(index).patchValue({is_active: !isActive})
  }

  removePromo(index: number){
    this.promosForm.removeAt(index);
  }


  getPromosArray(): FormArray{
    return (this.tariffForm.get('attribute_groups') as FormArray);
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  openEditor(event: Event, promo: any ) {
    (event.currentTarget as HTMLElement).blur();
    event.preventDefault();
    const modalRef: NgbModalRef = this.modalService.open(
      EditorModalComponent, 
      {
        backdropClass: 'ckedit-modal-backdrop', 
        windowClass: 'ckedit-modal',
        size: 'lg' 
      }
    );

    const control = promo as FormGroup

    let text = control.get('text_long')
    modalRef.componentInstance.initialValue = text?.value || ''
    
    modalRef.componentInstance.saveText.pipe(takeUntil(this.unsubscribe$)).subscribe((result: string) => {
      if (result !== undefined ) {

        control.patchValue({ text_long: result });
        text?.markAsTouched()
        modalRef.close(); // Закрытие модального окна после сохранения
      }
    });
    modalRef.componentInstance.close.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      text?.markAsTouched()
      modalRef.close(); // Закрытие модального окна при нажатии на отмену
    });
  }

  isPromoExpired(endDate: string): boolean {
    const currentDate = new Date();
    const promoEndDate = new Date(endDate);

    return promoEndDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
