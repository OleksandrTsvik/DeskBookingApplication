import { NgPlural, NgPluralCase } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';

import { ButtonComponent } from '@/shared/components/button/button.component';
import { CheckboxGroupComponent } from '@/shared/components/checkbox/checkbox-group.component';
import { CheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { DatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { DropdownComponent, DropdownOption } from '@/shared/components/dropdown/dropdown.component';
import { FormControlComponent } from '@/shared/components/form-control/form-control.component';
import { InputComponent } from '@/shared/components/input/input.component';
import { TimeDropdownComponent, TimeDropdownValue } from '@/shared/components/time-dropdown/time-dropdown.component';
import { Nullable } from '@/shared/models/common.models';
import { arrayRange } from '@/shared/utils/array.utils';
import { compareValuesValidator } from '@/shared/validators/compare-values.validator';

import { BookWorkspaceRequest, BookableWorkspaceResponse } from '../booking-page.models';
import { BookingPageService } from '../booking-page.service';

@Component({
  selector: 'app-booking-form',
  imports: [
    NgPlural,
    NgPluralCase,
    ReactiveFormsModule,
    ButtonComponent,
    CheckboxGroupComponent,
    CheckboxComponent,
    DatePickerComponent,
    DropdownComponent,
    FormControlComponent,
    InputComponent,
    TimeDropdownComponent,
  ],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css',
})
export class BookingFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  private bookingPageService = inject(BookingPageService);

  initWorkspaceTypeName = input<string>();
  submit = output<BookWorkspaceRequest>();

  form = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    workspaceId: ['', Validators.required],
    deskCount: this.formBuilder.control<number | null>(null),
    roomCapacity: this.formBuilder.control<number | null>(null),
    date: this.formBuilder.group(
      {
        startDate: this.formBuilder.control<Date | null>(null, Validators.required),
        endDate: this.formBuilder.control<Date | null>(null, Validators.required),
      },
      {
        validators: compareValuesValidator(
          ['startDate', 'endDate'],
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
          ['date.startDate', 'date.endDate', 'startTime', 'endTime'],
          (startDate: Date, endDate: Date, startTime: TimeDropdownValue, endTime: TimeDropdownValue) => {
            const startDateTime = this.applyTimeToDate(startDate, startTime);
            const endDateTime = this.applyTimeToDate(endDate, endTime);

            return endDateTime > startDateTime;
          },
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
    this.subscribeToLoadBookableWorkspaces();
    this.subscribeToWorkspaceIdChanges();
    this.subscribeToDateChanges();
  }

  onSubmit(event: Event): void {
    event.stopPropagation();

    if (this.form.invalid) {
      return;
    }

    const startDateTime = this.applyTimeToDate(this.form.value.date?.startDate, this.form.value.time?.startTime);
    const endDateTime = this.applyTimeToDate(this.form.value.date?.endDate, this.form.value.time?.endTime);

    const values: BookWorkspaceRequest = {
      name: this.form.value.name,
      email: this.form.value.email,
      workspaceId: this.form.value.workspaceId,
      deskCount: this.form.value.deskCount,
      roomCapacity: this.form.value.roomCapacity,
      startTime: startDateTime,
      endTime: endDateTime,
    };

    this.submit.emit(values);
  }

  private subscribeToLoadBookableWorkspaces(): void {
    this.isFetching.set(true);

    const subscription = this.bookingPageService.loadBookableWorkspaces().subscribe({
      next: (response) => {
        this.bookableWorkspaces.set(response);

        const initWorkspaceId = response.find((workspace) => workspace.name === this.initWorkspaceTypeName())?.id;

        this.form.patchValue({ workspaceId: initWorkspaceId });
      },
      complete: () => this.isFetching.set(false),
      error: () => this.isFetching.set(false),
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  private subscribeToWorkspaceIdChanges(): void {
    const subscription = this.form.controls.workspaceId.valueChanges.subscribe((value) => {
      this.handleWorkspaceIdChange(value);
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  private subscribeToDateChanges(): void {
    const subscription = this.form.controls.date.valueChanges.subscribe(() => {
      this.form.controls.time.updateValueAndValidity();
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  private handleWorkspaceIdChange(workspaceId: string | null): void {
    const prevWorkspaceId = this.form.value.workspaceId;
    const selectedWorkspace = this.bookableWorkspaces().find((workspace) => workspace.id === workspaceId);

    this.updateDeskCountOptions(selectedWorkspace?.deskCount);
    this.updateRoomCapacities(selectedWorkspace?.roomCapacities);

    this.setOrClearControlValidators(
      this.form.controls.deskCount,
      selectedWorkspace && selectedWorkspace.deskCount > 0,
      Validators.required,
    );

    this.setOrClearControlValidators(
      this.form.controls.roomCapacity,
      selectedWorkspace && selectedWorkspace.roomCapacities.length > 0,
      Validators.required,
    );

    if (prevWorkspaceId !== workspaceId) {
      this.form.patchValue({ deskCount: null, roomCapacity: null });
    }
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

  private applyTimeToDate(date: Nullable<Date>, time: Nullable<TimeDropdownValue>): Date {
    const updatedDate = date ? new Date(date) : new Date();

    if (time) {
      updatedDate.setHours(time.hours);
      updatedDate.setMinutes(time.minutes);
    }

    return updatedDate;
  }
}
