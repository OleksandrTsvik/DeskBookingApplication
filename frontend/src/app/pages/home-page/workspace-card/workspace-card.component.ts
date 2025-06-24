import { Component, computed, input, signal } from '@angular/core';

import { ButtonDirective } from '@/app/shared/components/button/button.directive';
import { SvgIconComponent } from '@/app/shared/components/svg-icon/svg-icon.component';
import { AmenitySvgIconDirective } from '@/app/shared/directives/amenity-icon.directive';

import { WorkspaceRoomResponse } from '../home-page.models';

const MAX_DISPLAY_PHOTOS = 4;

@Component({
  selector: 'app-workspace-card',
  imports: [ButtonDirective, SvgIconComponent, AmenitySvgIconDirective],
  templateUrl: './workspace-card.component.html',
  styleUrl: './workspace-card.component.css',
  host: {
    class: 'grid grid-cols-1 gap-4 rounded-xl bg-white p-3 sm:grid-cols-[1.94fr_5fr] sm:gap-8 sm:rounded-[20px] sm:p-4',
  },
})
export class WorkspaceCardComponent {
  name = input.required<string>();
  description = input.required<string>();
  photos = input.required<string[]>();

  amenities = input<string[]>();
  deskCount = input<number>();
  rooms = input<WorkspaceRoomResponse[]>();

  activePhotoIndex = signal(0);

  activePhoto = computed(() => this.photos()[this.activePhotoIndex()]);
  displayPhotos = computed(() => this.photos().slice(0, MAX_DISPLAY_PHOTOS));

  capacityRooms = computed(() => {
    if (!this.rooms()?.length) {
      return null;
    }

    const capacities = this.rooms()!
      .map((room) => room.capacity)
      .sort((a, b) => a - b);

    if (capacities.length == 2) {
      return capacities.join(' or ') + ' people';
    }

    return capacities.join(', ') + ' people';
  });

  displayRooms = computed(() =>
    this.rooms()
      ?.slice()
      .sort((a, b) => b.count - a.count),
  );

  onPhotoClick(index: number) {
    this.activePhotoIndex.set(index);
  }
}
