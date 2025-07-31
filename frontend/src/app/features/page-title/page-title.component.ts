import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IconDirective } from '@/shared/directives/icon.directive';

@Component({
  selector: 'app-page-title',
  imports: [NgClass, RouterLink, IconDirective],
  templateUrl: './page-title.component.html',
  styleUrl: './page-title.component.css',
})
export class PageTitleComponent {
  heading = input.required<string>();
  backLink = input<string>();
}
