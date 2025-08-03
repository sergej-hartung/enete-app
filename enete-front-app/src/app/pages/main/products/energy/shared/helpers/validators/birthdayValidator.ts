import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Prüft ein Geburtsdatum im Format "dd.MM.yyyy" (oder Date-Objekt)
 * und ob die Person mindestens `minAge` Jahre alt ist.
 *
 * - Leere Werte werden als gültig betrachtet (Required separat setzen).
 * - Ungültiges Datum oder zu jung -> { birthday: { requiredAge: number } }
 */
export function birthdayValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = control.value;

    if (raw === null || raw === undefined || raw === '') {
      return null; // "required" macht die Pflichtprüfung
    }

    let birthDate: Date | null = null;

    if (raw instanceof Date) {
      birthDate = raw;
    } else if (typeof raw === 'string') {
      // Erwartet "dd.MM.yyyy"
      const m = raw.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
      if (!m) return { birthday: { requiredAge: minAge } };

      const d = parseInt(m[1], 10);
      const mo = parseInt(m[2], 10);
      const y = parseInt(m[3], 10);

      birthDate = new Date(y, mo - 1, d);

      // Plausibilitätscheck (Date korrigiert z. B. 31.02. → 03.03.)
      if (
        birthDate.getFullYear() !== y ||
        birthDate.getMonth() !== mo - 1 ||
        birthDate.getDate() !== d
      ) {
        return { birthday: { requiredAge: minAge } };
      }
    } else {
      return { birthday: { requiredAge: minAge } };
    }

    const today = new Date();
    // Noch nicht geboren / Zukunftsdatum
    if (birthDate > today) return { birthday: { requiredAge: minAge } };

    // Altersberechnung
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasBirthdayPassedThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassedThisYear) age--;

    return age >= minAge ? null : { birthday: { requiredAge: minAge } };
  };
}
