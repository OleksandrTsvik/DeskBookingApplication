import { NgPlural, NgPluralCase, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  TemplateRef,
  computed,
  contentChild,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { CheckboxGroupComponent } from '@/shared/components/checkbox/checkbox-group.component';
import { CheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { DatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { DropdownComponent, DropdownOption } from '@/shared/components/dropdown/dropdown.component';
import { FormControlComponent } from '@/shared/components/form-control/form-control.component';
import { InputComponent } from '@/shared/components/input/input.component';
import { TimeDropdownComponent, TimeDropdownValue } from '@/shared/components/time-dropdown/time-dropdown.component';
import { arrayRange } from '@/shared/utils/array.utils';
import { dateOnlyToDate, toDateOnlyString, toTimeOnly, toTimeOnlyString } from '@/shared/utils/date.utils';
import { compareValuesValidator } from '@/shared/validators/compare-values.validator';

import { AvailableWorkspaceResponse, BookingFormInitValues, BookingFormValues } from './booking-form.models';
import { BookingFormService } from './booking-form.service';
import { SpinnerComponent } from "@/shared/components/spinner/spinner.component";

@Component({
  selector: 'app-booking-form',
  imports: [
    NgPlural,
    NgPluralCase,
    NgTemplateOutlet,
    ReactiveFormsModule,
    CheckboxGroupComponent,
    CheckboxComponent,
    DatePickerComponent,
    DropdownComponent,
    FormControlComponent,
    InputComponent,
    TimeDropdownComponent,
    SpinnerComponent
],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css',
})
export class BookingFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  private bookingFormService = inject(BookingFormService);

  initValues = input<Partial<BookingFormInitValues>>();
  submit = output<BookingFormValues>();

  actions = contentChild<TemplateRef<any>>('formActions');

  form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
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
          ['startTime', 'endTime'],
          (startTime: TimeDropdownValue, endTime: TimeDropdownValue) =>
            endTime.hours > startTime.hours || (endTime.hours === startTime.hours && endTime.minutes > startTime.hours),
        ),
      },
    ),
  });

  availableWorkspaces = signal<AvailableWorkspaceResponse[]>([]);
  isAvailableWorkspacesFetching = signal<boolean>(false);

  workspaceTypeOptions = computed<DropdownOption<string>[]>(() =>
    this.availableWorkspaces().map((workspace) => ({ label: workspace.name, value: workspace.id })),
  );

  deskCountOptions = signal<DropdownOption<number>[] | null>(null);
  roomCapacities = signal<number[] | null>(null);

  ngOnInit(): void {
    this.initFormValues();
    this.subscribeToLoadAvailableWorkspaces();
    this.subscribeToWorkspaceIdChanges();
  }

  onSubmit(event: Event): void {
    event.stopPropagation();

    if (this.form.invalid) {
      return;
    }

    const values: BookingFormValues = {
      name: this.form.value.name,
      email: this.form.value.email,
      workspaceId: this.form.value.workspaceId,
      deskCount: this.form.value.deskCount,
      roomCapacity: this.form.value.roomCapacity,
      startDate: toDateOnlyString(this.form.value.date?.startDate),
      endDate: toDateOnlyString(this.form.value.date?.endDate),
      startTime: toTimeOnlyString(this.form.value.time?.startTime),
      endTime: toTimeOnlyString(this.form.value.time?.endTime),
    };

    this.submit.emit(values);
  }

  private initFormValues(): void {
    const initValues = this.initValues();

    this.form.patchValue({
      name: initValues?.name || '',
      email: initValues?.email || '',
      date: {
        startDate: initValues?.startDate ? dateOnlyToDate(initValues.startDate) : null,
        endDate: initValues?.endDate ? dateOnlyToDate(initValues.endDate) : null,
      },
      time: {
        startTime: initValues?.startTime ? toTimeOnly(initValues.startTime) : null,
        endTime: initValues?.endTime ? toTimeOnly(initValues.endTime) : null,
      },
    });
  }

  private subscribeToLoadAvailableWorkspaces(): void {
    this.isAvailableWorkspacesFetching.set(true);

    const subscription = this.bookingFormService
      .loadAvailableWorkspaces()
      .pipe(finalize(() => this.isAvailableWorkspacesFetching.set(false)))
      .subscribe({
        next: (response) => {
          this.availableWorkspaces.set(response);

          const initValues = this.initValues();
          const initWorkspaceId = response.find(
            ({ id, name }) => id === initValues?.workspaceId || name === initValues?.workspaceName,
          )?.id;

          this.form.patchValue({
            workspaceId: initWorkspaceId,
            deskCount: initValues?.deskCount ?? null,
            roomCapacity: initValues?.roomCapacity ?? null,
          });
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  private subscribeToWorkspaceIdChanges(): void {
    const subscription = this.form.controls.workspaceId.valueChanges.subscribe((value) => {
      this.handleWorkspaceIdChange(value);
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  private handleWorkspaceIdChange(workspaceId: string | null): void {
    const prevWorkspaceId = this.form.value.workspaceId;
    const selectedWorkspace = this.availableWorkspaces().find((workspace) => workspace.id === workspaceId);

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
}
