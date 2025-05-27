/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 120,
  endOfLine: 'auto',
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@/(.*)(?<!\\.(svg|png|jpg|css|scss))$',
    '^\\.\\./(.*)(?<!\\.(svg|png|jpg|css|scss))$',
    '^\\./(.*)(?<!\\.(svg|png|jpg|css|scss))$',
    '\\.(svg|png|jpg)$',
    '\\.(css|scss)$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  cssDeclarationSorterOrder: 'concentric-css',
  cssDeclarationSorterKeepOverrides: true,
  tailwindStylesheet: './src/styles/styles.scss',
  tailwindPreserveWhitespace: false,
  tailwindPreserveDuplicates: false,
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-css-order', 'prettier-plugin-tailwindcss'],
};

export default config;
