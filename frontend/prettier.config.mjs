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
  singleAttributePerLine: true,
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@/(.*)(?<!\\.(svg|png|jpg|css|scss))$',
    '^\\.\\./(.*)(?<!\\.(svg|png|jpg|css|scss))$',
    '^\\./(.*)(?<!\\.(svg|png|jpg|css|scss))$',
    '\\.(svg|png|jpg)$',
    '\\.(css|scss)$',
  ],
  attributeSort: 'ASC',
  attributeGroups: [
    '$ANGULAR_ELEMENT_REF',
    '$ANGULAR_STRUCTURAL_DIRECTIVE',
    '^app',
    '^routerLink',
    '$CODE_GUIDE',
    '$DEFAULT',
    '$ANGULAR_INPUT',
    '$ANGULAR_OUTPUT',
    '$ANGULAR_TWO_WAY_BINDING',
  ],
  cssDeclarationSorterOrder: 'concentric-css',
  cssDeclarationSorterKeepOverrides: true,
  tailwindStylesheet: './src/styles/styles.css',
  tailwindPreserveWhitespace: false,
  tailwindPreserveDuplicates: false,
  tailwindAttributes: [],
  tailwindFunctions: ['clsx', 'tw'],
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-organize-attributes',
    'prettier-plugin-css-order',
    'prettier-plugin-tailwindcss',
  ],
};

export default config;
