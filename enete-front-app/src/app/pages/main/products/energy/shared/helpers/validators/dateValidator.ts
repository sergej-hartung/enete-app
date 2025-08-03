import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Hilfsfunktionen zum Parsen/Normalisieren von Datumswerten
 */
function parseDDMMYYYY(value: string): Date | null {
  const m = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return null;

  const d = parseInt(m[1], 10);
  const mo = parseInt(m[2], 10);
  const y = parseInt(m[3], 10);

  const date = new Date(y, mo - 1, d);
  // Plausibilitätscheck (Date korrigiert z. B. 31.02. -> 03.03.)
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== mo - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

function coerceToDate(raw: unknown): Date | null {
  if (raw == null || raw === '') return null;
  if (raw instanceof Date) return isNaN(raw.getTime()) ? null : raw;
  if (typeof raw === 'string') return parseDDMMYYYY(raw);
  return null;
}

function normalizeToMidnight(d: Date): Date {
  const n = new Date(d.getTime());
  n.setHours(0, 0, 0, 0);
  return n;
}

/**
 * Export-Objekt mit den Validator-Erzeugern wie in deinem Code genutzt.
 *
 * Fehler-Keys:
 *  - { dateMinimum: { min: Date, actual: Date } }
 *  - { dateMaximum: { max: Date, actual: Date } }
 *  - { dateInvalid: true }  (falls das Datum nicht geparst werden konnte)
 */
export const dateValidator = {
  /**
   * Mindestdatum (inklusive) prüfen.
   * Beispiel: control muss >= minDate sein.
   */
  dateMinimum(minDate: Date): ValidatorFn {
    const min = normalizeToMidnight(minDate);
    return (control: AbstractControl): ValidationErrors | null => {
      const raw = control.value;
      if (raw == null || raw === '') return null; // required separat
      const parsed = coerceToDate(raw);
      if (!parsed) return { dateInvalid: true };

      const val = normalizeToMidnight(parsed);
      return val.getTime() < min.getTime()
        ? { dateMinimum: { min, actual: val } }
        : null;
    };
  },

  /**
   * Höchstdatum (inklusive) prüfen.
   * Beispiel: control muss <= maxDate sein.
   */
  dateMaximum(maxDate: Date): ValidatorFn {
    const max = normalizeToMidnight(maxDate);
    return (control: AbstractControl): ValidationErrors | null => {
      const raw = control.value;
      if (raw == null || raw === '') return null; // required separat
      const parsed = coerceToDate(raw);
      if (!parsed) return { dateInvalid: true };

      const val = normalizeToMidnight(parsed);
      return val.getTime() > max.getTime()
        ? { dateMaximum: { max, actual: val } }
        : null;
    };
  },
};
