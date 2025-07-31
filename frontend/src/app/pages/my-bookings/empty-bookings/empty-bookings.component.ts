import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'app-empty-bookings',
  imports: [RouterLink, ButtonComponent],
  templateUrl: './empty-bookings.component.html',
  host: {
    class: 'flex min-h-119 flex-col items-center justify-center gap-8 rounded-[20px] bg-white p-4',
  },
})
export class EmptyBookingsComponent {}
