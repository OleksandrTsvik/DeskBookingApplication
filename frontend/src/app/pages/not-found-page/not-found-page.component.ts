import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonDirective } from '@/shared/components/button/button.directive';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, ButtonDirective],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.css',
})
export class NotFoundPageComponent {}
