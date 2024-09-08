import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

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

  private unsubscribe$ = new Subject<void>();

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  ngOnInit(): void {
    this.control.get('customFild')?.valueChanges
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((value: any) => {
      console.log(value)
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}


