import { NgPlural, NgPluralCase } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';

import { PageTitleComponent } from '@/features/page-title/page-title.component';
import { ButtonDirective } from '@/shared/components/button/button.directive';
import { CheckboxGroupComponent } from '@/shared/components/checkbox/checkbox-group.component';
import { CheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { DatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { DropdownComponent, DropdownOption } from '@/shared/components/dropdown/dropdown.component';
import { InputComponent } from '@/shared/components/input/input.component';
import { TimeDropdownComponent, TimeDropdownValue } from '@/shared/components/time-dropdown/time-dropdown.component';
import { Nullable } from '@/shared/models/common.models';
import { arrayRange } from '@/shared/utils/array.utils';
import { compareValuesValidator } from '@/shared/validators/compare-values.validator';

import { BookableWorkspaceResponse } from './booking-page.models';
import { BookingPageService } from './booking-page.service';

@Component({
  selector: 'app-booking-page',
  imports: [
    NgPlural,
    NgPluralCase,
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
export class BookingPageComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  private bookingPageService = inject(BookingPageService);

  form = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    workspaceTypeId: ['', Validators.required],
    deskCount: this.formBuilder.control<number | null>(null),
    roomSize: this.formBuilder.control<number | null>(null),
    date: this.formBuilder.group(
      {
        startDate: this.formBuilder.control<Date | null>(null, Validators.required),
        endDate: this.formBuilder.control<Date | null>(null, Validators.required),
      },
      {
        validators: compareValuesValidator(
          'startDate',
          'endDate',
          (startDate: Date, endDate: Date) => endDate >= startDate,
        ),
      },
    ),
    time: this.formBuilder.group(
      {
        startTime: this.formBuilder.control<TimeDropdownValue | null>(null, Validators.required),
        endTime: this.formBuilder.control<TimeDropdownValue | null>(null, Validators.required),
      },
      {
        validators: compareValuesValidator(
          'startTime',
          'endTime',
          (startTime: TimeDropdownValue, endTime: TimeDropdownValue) =>
            endTime.hours > startTime.hours ||
            (endTime.hours === startTime.hours && endTime.minutes > startTime.minutes),
        ),
      },
    ),
  });

  bookableWorkspaces = signal<BookableWorkspaceResponse[]>([]);
  isFetching = signal<boolean>(false);

  workspaceTypeOptions = computed<DropdownOption<string>[]>(() =>
    this.bookableWorkspaces().map((workspace) => ({ label: workspace.name, value: workspace.id })),
  );

  deskCountOptions = signal<DropdownOption<number>[] | null>(null);
  roomCapacities = signal<number[] | null>(null);

  ngOnInit(): void {
    this.isFetching.set(true);

    const loadBookableWorkspacesSubscription = this.bookingPageService.loadBookableWorkspaces().subscribe({
      next: (response) => this.bookableWorkspaces.set(response),
      complete: () => this.isFetching.set(false),
      error: () => this.isFetching.set(false),
    });

    this.destroyRef.onDestroy(() => {
      loadBookableWorkspacesSubscription.unsubscribe();
    });
  }

  onWorkspaceTypeIdChange(workspaceTypeId: string): void {
    const selectedWorkspace = this.bookableWorkspaces().find((workspace) => workspace.id === workspaceTypeId);

    this.updateDeskCountOptions(selectedWorkspace?.deskCount);
    this.updateRoomCapacities(selectedWorkspace?.roomCapacities);

    this.setOrClearControlValidators(
      this.form.controls.deskCount,
      selectedWorkspace && selectedWorkspace.deskCount > 0,
      Validators.required,
    );

    this.setOrClearControlValidators(
      this.form.controls.roomSize,
      selectedWorkspace && selectedWorkspace.roomCapacities.length > 0,
      Validators.required,
    );

    if (this.form.value.workspaceTypeId !== workspaceTypeId) {
      this.form.patchValue({ deskCount: null, roomSize: null });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const startDateTime = this.form.value.date?.startDate;
    const endDateTime = this.form.value.date?.endDate;

    this.applyTimeToDate(startDateTime, this.form.value.time?.startTime);
    this.applyTimeToDate(endDateTime, this.form.value.time?.endTime);

    const values = {
      name: this.form.value.name,
      email: this.form.value.email,
      workspaceTypeId: this.form.value.workspaceTypeId,
      deskCount: this.form.value.deskCount,
      roomSize: this.form.value.roomSize,
      startTime: startDateTime,
      endTime: endDateTime,
    };

    console.log(values);
  }

  private updateDeskCountOptions(deskCount: number | undefined): void {
    if (!deskCount || deskCount < 1) {
      this.deskCountOptions.set(null);
      return;
    }

    this.deskCountOptions.set(arrayRange(1, deskCount).map((item) => ({ label: item, value: item })));
  }

  private updateRoomCapacities(roomCapacities: number[] | undefined): void {
    if (!roomCapacities?.length) {
      this.roomCapacities.set(null);
      return;
    }

    this.roomCapacities.set(roomCapacities.sort((a, b) => a - b));
  }

  private setOrClearControlValidators(
    control: FormControl,
    condition: boolean | undefined,
    validators: ValidatorFn | ValidatorFn[],
  ): void {
    if (condition) {
      control.setValidators(validators);
    } else {
      control.clearValidators();
      control.reset();
    }
  }

  private applyTimeToDate(date: Nullable<Date>, time: Nullable<TimeDropdownValue>): void {
    if (!date || !time) {
      return;
    }

    date.setHours(time.hours);
    date.setMinutes(time.minutes);
  }
}
