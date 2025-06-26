import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SvgIconComponent } from '@/shared/components/svg-icon/svg-icon.component';

@Component({
  selector: 'app-page-title',
  imports: [NgClass, RouterLink, SvgIconComponent],
  templateUrl: './page-title.component.html',
  styleUrl: './page-title.component.css',
})
export class PageTitleComponent {
  text = input.required<string>();
  backLink = input<string>();
}
