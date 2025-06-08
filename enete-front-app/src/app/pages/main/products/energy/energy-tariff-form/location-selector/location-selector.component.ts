import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';

interface City {
  city: string;
  zip?: string;
}

interface NetzProvider {
  netzName: string;
}

@Component({
  selector: 'app-location-selector',
  imports: [CommonModule, NgbTypeahead, ReactiveFormsModule,],
  templateUrl: './location-selector.component.html',
  styleUrl: './location-selector.component.scss'
})
export class LocationSelectorComponent {
  @Input() formGroup!: FormGroup;
  @Input() citys: City[] = [];
  @Input() streets: string[] = [];
  @Input() netzProviders: NetzProvider[] = [];

  @Output() blurStreet = new EventEmitter<string>();

  @Input() search!: (text$: Observable<string>) => Observable<string[]>;

  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  blur$ = new Subject<string>();

  ngOnInit(): void {}

  onStreetBlur(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    this.blurStreet.emit(target.value);
  }

  isInvalid(controlName: string): boolean {
    const control = this.formGroup.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

}
