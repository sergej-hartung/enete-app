import { AbstractControl, ValidatorFn } from '@angular/forms';

// Функция валидатора
export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const value = control.value;
    if (value) {
      // Регулярное выражение для проверки формата даты
      const regex = /^\d{4}-\d{2}-\d{2}$/;

      // Проверка соответствия регулярному выражению
      if (!regex.test(value)) {
        // Если не соответствует формату
        return { 'dateInvalidFormat': true };
      }

      // Проверка на валидность даты
      const date = new Date(value);
      if (!date.getTime() && date.getTime() !== 0) {
        // Если дата недействительна
        return { 'dateInvalid': true };
      }
    }
    // Если все проверки пройдены
    return null;
  };
}
