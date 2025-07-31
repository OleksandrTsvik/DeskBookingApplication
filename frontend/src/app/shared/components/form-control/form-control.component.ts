import { Component, OnInit, contentChild, inject, input } from '@angular/core';
import { AbstractControlDirective, ControlContainer, NgControl, ValidationErrors } from '@angular/forms';

import { InterpolatePipe } from '@/shared/pipes/interpolate.pipe';

import { DEFAULT_ERROR_MESSAGES } from './form-control.constants';

type ErrorMessage = { code: string; message: string };

@Component({
  selector: 'app-form-control',
  imports: [InterpolatePipe],
  templateUrl: './form-control.component.html',
  styleUrl: './form-control.component.css',
})
export class FormControlComponent implements OnInit {
  private hostFormGroup = inject(ControlContainer, { self: true, optional: true });
  private childFormGroup = contentChild(ControlContainer);
  private childFormControl = contentChild(NgControl);

  errorClass = input<string>('mt-1');
  validationErrorMessages = input<ValidationErrors>();

  control?: AbstractControlDirective;
  errorMessages: ErrorMessage[] = [];

  get showErrors() {
    return this.control?.dirty && this.errorMessages.some(({ code }) => this.control?.hasError(code));
  }

  ngOnInit(): void {
    this.control = this.hostFormGroup ?? this.childFormGroup() ?? this.childFormControl();

    const validationErrors = {
      ...DEFAULT_ERROR_MESSAGES,
      ...this.validationErrorMessages(),
    };

    this.errorMessages = Object.entries(validationErrors).map(([code, message]) => ({ code, message }));
  }
}
