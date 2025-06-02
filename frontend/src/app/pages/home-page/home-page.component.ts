import { Component } from '@angular/core';

import { WorkspaceCardComponent } from '@/app/pages/home-page/workspace-card/workspace-card.component';

@Component({
  selector: 'app-home-page',
  imports: [WorkspaceCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  workspaces = [
    {
      type: 'Open space',
      description:
        'A vibrant shared area perfect for freelancers or small teams who enjoy a collaborative atmosphere. Choose any available desk and get to work with flexibility and ease.',
      photos: [
        'photos/open-space-1.png',
        'photos/open-space-2.png',
        'photos/open-space-3.png',
        'photos/open-space-4.png',
      ],
    },
    {
      type: 'Private rooms',
      description:
        'Ideal for focused work, video calls, or small team huddles. These fully enclosed rooms offer privacy and come in a variety of sizes to fit your needs.',
      photos: [
        'photos/private-rooms-1.png',
        'photos/private-rooms-2.png',
        'photos/private-rooms-3.png',
        'photos/private-rooms-4.png',
      ],
    },
    {
      type: 'Meeting rooms',
      description:
        'Designed for productive meetings, workshops, or client presentations. Equipped with screens, whiteboards, and comfortable seating to keep your sessions running smoothly.',
      photos: [
        'photos/meeting-rooms-1.png',
        'photos/meeting-rooms-2.png',
        'photos/meeting-rooms-3.png',
        'photos/meeting-rooms-4.png',
      ],
    },
  ];
}
