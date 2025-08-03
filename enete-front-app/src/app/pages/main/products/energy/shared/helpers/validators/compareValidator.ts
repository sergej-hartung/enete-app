import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Vergleicht den Wert eines Controls mit `otherControl`.
 *
 * - Ohne `reverse`: validiert *dieses* Control (ungleich -> { compare: true }).
 * - Mit `reverse=true`: erzeugt **keinen** Fehler auf *diesem* Control,
 *   sondern stößt lediglich die Re-Validierung des `otherControl` an.
 *   (Nutzen: Wenn sich die "Quelle" ändert, wird das Bestätigungsfeld neu geprüft.)
 *
 * Beispiel:
 *   email.setValidators([compareValidator(emailConfirm, true)]);
 *   emailConfirm.setValidators([compareValidator(email)]);
 */
export function compareValidator(otherControl: AbstractControl, reverse = false): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!otherControl) return null;

    if (reverse) {
      // Wenn dieses Control sich ändert, soll das andere erneut validieren
      // (ohne Fehler hier zu setzen).
      if (control && otherControl) {
        otherControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }
      return null;
    }

    const a = control?.value;
    const b = otherControl?.value;

    return a === b ? null : { compare: true };
  };
}
