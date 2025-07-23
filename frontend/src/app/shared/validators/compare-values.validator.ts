import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { Nullable } from '../models/common.models';
import { isNonNullable, isNullable } from '../utils/type-guards';

export function compareValuesValidator<ValueTypes extends unknown[]>(
  controlPaths: string[],
  comparator: (...controlValues: ValueTypes) => boolean,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlValues = controlPaths.map((controlPath) => {
      let currentControl: Nullable<AbstractControl> = control;
      let childControl: Nullable<AbstractControl> = currentControl.get(controlPath);

      while (isNonNullable(currentControl) && isNullable(childControl)) {
        currentControl = currentControl.parent;
        childControl = currentControl?.get(controlPath);
      }

      return childControl?.value;
    }) as ValueTypes;

    if (controlValues.some(isNullable)) {
      return null;
    }

    return comparator(...controlValues) ? null : { invalidRange: true };
  };
}
