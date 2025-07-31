export function arrayRange(start: number, stop: number, step: number = 1): number[] {
  return Array.from({ length: (stop - start) / step + 1 }, (_, index) => start + index * step);
}
