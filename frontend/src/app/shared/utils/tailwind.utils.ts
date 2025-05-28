/**
 * Utility function to enable sorting of Tailwind CSS classes by `prettier-plugin-tailwindcss`.
 */
export function tw(strings: TemplateStringsArray): string {
  return String.raw({ raw: strings });
}
