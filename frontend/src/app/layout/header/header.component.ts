import { DOCUMENT } from '@angular/common';
import { Component, Renderer2, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);

  isMenuOpen = signal(false);

  links = [
    { title: 'Workspaces', href: '/workspaces' },
    { title: 'My bookings', href: '/bookings' },
  ];

  onMenuIconClick(): void {
    this.isMenuOpen.update((prevIsMenuOpen) => !prevIsMenuOpen);
    this.toggleBodyClass();
  }

  onLinkClick(): void {
    this.isMenuOpen.set(false);
    this.toggleBodyClass();
  }

  private toggleBodyClass(): void {
    if (this.isMenuOpen()) {
      this.renderer.addClass(this.document.body, 'overflow-hidden');
    } else {
      this.renderer.removeClass(this.document.body, 'overflow-hidden');
    }
  }
}
