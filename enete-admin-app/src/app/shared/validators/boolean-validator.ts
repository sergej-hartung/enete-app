import { AbstractControl, ValidatorFn } from '@angular/forms';

// Функция валидатора для проверки boolean
export function booleanValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid = control.value=== null || control.value === true || control.value === false || control.value === 1 || control.value === 0;
    return valid ? null : { 'notBoolean': true };
  };
}
