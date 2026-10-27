import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
    plugins: ['unicorn', 'typescript', 'oxc'],
    categories: {
      correctness: 'error',
      perf: 'error',
      suspicious: 'error',
    },
    rules: {
      'eslint/no-await-in-loop': 'off',
      'no-console': ['error', { allow: ['error'] }],
      'no-shadow': 'off',
      'typescript/no-unnecessary-boolean-literal-compare': 'off',
      'typescript/no-unsafe-type-assertion': 'off',
      curly: 'error',
    },
    overrides: [
      {
        files: ['packages/*/build.ts', 'packages/tools/**/*.ts'],
        rules: {
          'no-console': 'off',
        },
      },
      {
        // node:test 的 test() 返回 Promise, 由运行器统一等待
        files: ['packages/*/test/**/*.ts'],
        rules: {
          'typescript/no-floating-promises': 'off',
        },
      },
    ],
    ignorePatterns: [],
  },
  fmt: {
    ignorePatterns: [],
    singleQuote: true,
    semi: true,
    sortPackageJson: true,
    sortImports: {
      groups: [
        ['type-import'],
        ['type-builtin', 'value-builtin'],
        ['type-external', 'value-external', 'type-internal', 'value-internal'],
        [
          'type-parent',
          'type-sibling',
          'type-index',
          'value-parent',
          'value-sibling',
          'value-index',
        ],
        ['unknown'],
      ],
      newlinesBetween: true,
      order: 'asc',
    },
  },
});
