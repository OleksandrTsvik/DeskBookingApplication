import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { PageTitleComponent } from '@/features/page-title/page-title.component';
import { ButtonDirective } from '@/shared/components/button/button.directive';
import { CheckboxGroupComponent } from '@/shared/components/checkbox/checkbox-group.component';
import { CheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { DatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { DropdownComponent } from '@/shared/components/dropdown/dropdown.component';
import { InputComponent } from '@/shared/components/input/input.component';
import { TimeDropdownComponent, TimeDropdownValue } from '@/shared/components/time-dropdown/time-dropdown.component';

@Component({
  selector: 'app-booking-page',
  imports: [
    ReactiveFormsModule,
    PageTitleComponent,
    ButtonDirective,
    CheckboxGroupComponent,
    CheckboxComponent,
    DatePickerComponent,
    DropdownComponent,
    InputComponent,
    TimeDropdownComponent,
  ],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.css',
})
export class BookingPageComponent {
  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    workspaceType: ['', Validators.required],
    startDate: this.formBuilder.control<Date | null>(null, Validators.required),
    endDate: this.formBuilder.control<Date | null>(null, Validators.required),
    startTime: this.formBuilder.control<TimeDropdownValue | null>(null, Validators.required),
    endTime: this.formBuilder.control<TimeDropdownValue | null>(null, Validators.required),
  });

  onSubmit(): void {
    console.log(this.form.value.startTime?.hours);
  }
}
