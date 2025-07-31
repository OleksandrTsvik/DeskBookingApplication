import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'interpolate',
})
export class InterpolatePipe implements PipeTransform {
  transform(value: string, params: Record<string, any>): string {
    if (!value || !params) {
      return value;
    }

    return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => params[key] || '');
  }
}
