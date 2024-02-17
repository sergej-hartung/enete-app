import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const matchPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  // Убедитесь, что control действительно является FormGroup
  if (!(control instanceof FormGroup)) {
    return null; // или выбросьте ошибку, если это неожиданное использование валидатора
  }

  const password = control.get('password')?.value;
  const passwordConfirmation = control.get('password_confirmation')?.value;

  // console.log(password)
  // console.log(passwordConfirmation)
  // Проверяем, не пусты ли поля. Если оба пусты, возвращаем null (нет ошибки)
  if (!password && !passwordConfirmation) {
    return null;
  }

  // Если поля не совпадают, возвращаем объект ошибки
  return password && passwordConfirmation && password === passwordConfirmation ? null : { 'passwordMismatch': true };
};