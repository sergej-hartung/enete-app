import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject, take, takeUntil } from 'rxjs';
import { EditorModalComponent } from '../../../../../../shared/components/editor-modal/editor-modal.component';

@Component({
  selector: 'app-attribute-box',
  templateUrl: './attribute-box.component.html',
  styleUrl: './attribute-box.component.scss'
})
export class AttributeBoxComponent {
  @Input() control!: any;
  @Input() isMatrix: boolean = false;
  @Input() blockIndex: number = 0;
  @Input() controlIndex: number = 0;
  @Input() isCollapsed: boolean = true;
  @Output() removeTpl = new EventEmitter<any>();

  textAreaIsCollapsed: boolean = true
  private unsubscribe$ = new Subject<void>();

  toggleCollapseTextArea(){
    this.textAreaIsCollapsed = !this.textAreaIsCollapsed
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  constructor(
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.control.get('customFild')?.valueChanges
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((value: any) => {
      if(value){
        this.control.patchValue({
          autoFieldName: false,
          autoValueSource: false,
          autoUnit: false
        })
      }else{
        this.control.patchValue({
          autoFieldName: true,
          autoValueSource: true,
          autoUnit: true,
          showIcon: true,
          showFieldName: true,
          showValue: true,
          showUnit: true,
        })
      }
    })

    this.handleFormFildIcon()
    this.handleFormFildName()
    this.handleFormFildValue()
    this.handleFormFildUnit()
  }

  openEditor(event: Event, control: FormGroup) {
    event.preventDefault();
    (event.target as HTMLElement).blur();

    const modalRef = this.openModal();
    //const control = this.getAttributeFormArray(group).at(index) as FormGroup;
    const textControl = control.get('manualValueHtml');
    //const attribute = group.attributs[index];

    //textControl?.setValue(attribute.pivot?.value_text || textControl?.value || '');
    modalRef.componentInstance.initialValue = textControl?.value || '';

    this.handleModalSaveClose(modalRef, control, textControl);
  }

  private openModal(): NgbModalRef {
    return this.modalService.open(EditorModalComponent, {
      backdropClass: 'ckedit-modal-backdrop',
      windowClass: 'ckedit-modal',
      size: 'lg'
    });
  }

  private handleModalSaveClose(modalRef: NgbModalRef, control: AbstractControl, textControl: AbstractControl | null): void {
    const markAsTouchedAndClose = () => {
      textControl?.markAsTouched();
      modalRef.close();
    };

    modalRef.componentInstance.saveText.pipe(take(1)).subscribe((result: any) => {
      if (result !== undefined) {
        const valueHtml = control.get('manualValueHtml')
        const isHtml = control.get('isHtml')
        const manualValue = control.get('manualValue')
        valueHtml?.patchValue(result)
        isHtml?.patchValue(true)
        manualValue?.patchValue('')
        console.log(control)
        //control.patchValue({ value_text: result });
        markAsTouchedAndClose();
      }
    });

    modalRef.componentInstance.close.pipe(take(1)).subscribe(markAsTouchedAndClose);
  }

  handleFormFildIcon(){
    this.control.get('showIcon')?.valueChanges
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((value: any) => {
      this.control.patchValue({
        icon: ''
      })
    })
  }

  handleFormFildName(){
    this.control.get('showFieldName')?.valueChanges
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((value: any) => {
      this.control.patchValue({
        manualFieldName: ''
      })
    })

    this.control.get('autoFieldName')?.valueChanges
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((value: any) => {
      this.control.patchValue({
        manualFieldName: ''
      })
    })
  }

  handleFormFildValue(){
    this.control.get('showValue')?.valueChanges
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((value: any) => {
      //console.log(value)
      if(!value){
        this.textAreaIsCollapsed = true
      }
      this.control.patchValue({
        manualValue: ''
      })
    })

    this.control.get('autoValueSource')?.valueChanges
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((value: any) => {
      this.control.patchValue({
        manualValue: ''
      })
    })

    this.control.get('manualValue')?.valueChanges
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((value: any) => {
      if(value){
        const valueHtml = this.control.get('manualValueHtml')
        const isHtml = this.control.get('isHtml')
        valueHtml?.patchValue('')
        isHtml?.patchValue(false)
        this.textAreaIsCollapsed = true
      }
    })
  }

  handleFormFildUnit(){
    this.control.get('showUnit')?.valueChanges
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((value: any) => {
      this.control.patchValue({
        manualUnit: ''
      })
    })

    this.control.get('autoUnit')?.valueChanges
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((value: any) => {
      this.control.patchValue({
        manualUnit: ''
      })
    })
  }

  removeControl(control: any){
    this.removeTpl.emit(control)
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}


