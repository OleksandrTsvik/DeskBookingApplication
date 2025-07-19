import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { isNullable } from '../utils/type-guards';

export function compareValuesValidator<T>(
  controlName1: string,
  controlName2: string,
  comparator: (controlValue1: T, controlValue2: T) => boolean,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value1 = control.get(controlName1)?.value;
    const value2 = control.get(controlName2)?.value;

    if (isNullable(value1) || isNullable(value2)) {
      return null;
    }

    return comparator(value1, value2) ? null : { invalidRange: true };
  };
}
