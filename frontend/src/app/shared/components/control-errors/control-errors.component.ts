import { Component, Injector, OnInit, inject, input } from '@angular/core';
import { AbstractControl, NgControl, ValidationErrors } from '@angular/forms';

import { Nullable } from '@/shared/models/common.models';

import { DEFAULT_ERROR_MESSAGES } from './control-errors.constants';

type ErrorMessage = { code: string; message: string };

@Component({
  selector: 'app-control-errors',
  imports: [],
  templateUrl: './control-errors.component.html',
  styleUrl: './control-errors.component.css',
  host: {
    '[class.hidden]': 'formControl?.valid || formControl?.pristine',
  },
})
export class ControlErrorsComponent implements OnInit {
  private injector = inject(Injector);

  control = input<AbstractControl>();
  messages = input<ValidationErrors>();

  formControl: Nullable<AbstractControl | NgControl>;
  errorMessages: ErrorMessage[] = [];

  ngOnInit(): void {
    this.formControl = this.control() ?? this.injector.get(NgControl, null);

    const messages = {
      ...DEFAULT_ERROR_MESSAGES,
      ...this.messages(),
    };

    this.errorMessages = Object.entries(messages).map(([code, message]) => ({ code, message }));
  }
}
