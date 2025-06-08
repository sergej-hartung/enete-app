import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-consumption-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './consumption-form.component.html',
  styleUrl: './consumption-form.component.scss'
})
export class ConsumptionFormComponent {
  @Input() formGroup!: FormGroup;

  @Output() peopleChange = new EventEmitter<string>();
  @Output() consumChange = new EventEmitter<string>();
  @Output() consumNtChange = new EventEmitter<string>();

  onConsumInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.consumChange.emit(value);
  }

  onConsumNtInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.consumNtChange.emit(value);
  }

  isInvalid(controlName: string): boolean {
    const control = this.formGroup.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
