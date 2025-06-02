import { Component, computed, input, signal } from '@angular/core';

import { ButtonDirective } from '@/app/shared/components/button/button.directive';
import { SvgIconComponent } from '@/app/shared/components/svg-icon/svg-icon.component';

@Component({
  selector: 'app-workspace-card',
  imports: [ButtonDirective, SvgIconComponent],
  templateUrl: './workspace-card.component.html',
  styleUrl: './workspace-card.component.css',
  host: {
    class: 'grid grid-cols-1 gap-4 rounded-xl bg-white p-3 sm:grid-cols-[1.94fr_5fr] sm:gap-8 sm:rounded-[20px] sm:p-4',
  },
})
export class WorkspaceCardComponent {
  type = input.required<string>();
  description = input.required<string>();
  photos = input.required<string[]>();

  activePhotoIndex = signal(0);

  activePhoto = computed(() => this.photos()[this.activePhotoIndex()]);

  onPhotoClick(index: number) {
    this.activePhotoIndex.set(index);
  }
}
