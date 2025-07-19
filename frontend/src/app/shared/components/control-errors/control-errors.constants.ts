import { ValidationErrors } from '@angular/forms';

export const DEFAULT_ERROR_MESSAGES: ValidationErrors = {
  required: 'This is a required field.',
  email: 'Email format is invalid.',
  incompleteDate: 'incompleteDate',
  invalidRange: 'invalidRange',
};
