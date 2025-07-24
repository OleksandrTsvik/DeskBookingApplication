import { DatePipe, NgPlural, NgPluralCase } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonDirective } from '@/shared/components/button/button.directive';
import { AmenityIconDirective } from '@/shared/directives/amenity-icon.directive';
import { IconDirective } from '@/shared/directives/icon.directive';

import { WorkspaceResponse } from '../home-page.models';

const MAX_DISPLAY_PHOTOS = 4;

@Component({
  selector: 'app-workspace-card',
  imports: [DatePipe, NgPlural, NgPluralCase, RouterLink, ButtonDirective, AmenityIconDirective, IconDirective],
  templateUrl: './workspace-card.component.html',
  styleUrl: './workspace-card.component.css',
  host: {
    class: 'grid grid-cols-1 gap-4 rounded-xl bg-white p-3 sm:grid-cols-[1.94fr_5fr] sm:gap-8 sm:rounded-[20px] sm:p-4',
  },
})
export class WorkspaceCardComponent {
  workspace = input.required<WorkspaceResponse>();

  activePhotoIndex = signal(0);

  activePhoto = computed(() => this.workspace().photos[this.activePhotoIndex()]);
  displayPhotos = computed(() => this.workspace().photos.slice(0, MAX_DISPLAY_PHOTOS));

  capacityRooms = computed(() => {
    const rooms = this.workspace().rooms;

    if (!rooms?.length) {
      return null;
    }

    const capacities = rooms.map((room) => room.capacity).sort((a, b) => a - b);

    if (capacities.length === 1 && capacities[0] === 1) {
      return '1 person';
    }

    if (capacities.length === 2) {
      return capacities.join(' or ') + ' people';
    }

    return capacities.join(', ') + ' people';
  });

  displayRooms = computed(() =>
    this.workspace()
      .rooms?.slice()
      .sort((a, b) => b.count - a.count),
  );

  onPhotoClick(index: number) {
    this.activePhotoIndex.set(index);
  }
}
