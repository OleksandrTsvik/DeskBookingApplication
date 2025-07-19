import { ValidationErrors } from '@angular/forms';

export const DEFAULT_ERROR_MESSAGES: ValidationErrors = {
  required: 'This field is required.',
  email: 'Email format is invalid.',
  incompleteDate: 'Please complete all parts of the date.',
  invalidRange: 'The selected range is invalid.',
};
