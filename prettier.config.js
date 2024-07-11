module.exports = {
  parser: '',
  printWidth: 80,
  semi: true,
  tabWidth: 2,
  trailingComma: 'all',
  singleQuote: true,
  bracketSpacing: true,

  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['decorators-legacy', 'typescript'],
};
