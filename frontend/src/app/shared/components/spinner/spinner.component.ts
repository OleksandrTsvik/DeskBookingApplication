import { NgClass } from '@angular/common';
import { Component, computed, input, numberAttribute } from '@angular/core';

const sizeClasses: Record<number, string> = {
  1: 'size-4',
  2: 'size-8',
  3: 'size-12',
  4: 'size-16',
  5: 'size-20',
};

@Component({
  selector: 'app-spinner',
  imports: [NgClass],
  templateUrl: './spinner.component.html',
  host: {
    class: 'flex w-full flex-col items-center justify-center gap-4 p-2',
  },
})
export class SpinnerComponent {
  tip = input<string>();
  size = input(4, { transform: numberAttribute });

  sizeClass = computed(() => sizeClasses[this.size()] || sizeClasses[4]);
}
