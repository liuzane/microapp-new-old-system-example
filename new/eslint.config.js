import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default defineConfig([
  globalIgnores(['dist', 'public', '@mf-types']),

  // 基础配置（应用于所有支持的文件）
  {
    files: ['**/*.{js,ts,vue}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      ...vue.configs['flat/recommended'],
      stylistic.configs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },

  // 自定义规则（覆盖默认）
  {
    name: 'app/custom-rules',
    files: ['**/*.{js,ts,vue}'],
    rules: {
      // Vue 特定规则覆盖
      'vue/multi-word-component-names': 'off',

      // TypeScript 规则保留
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/typedef': [
        'error',
        {
          arrayDestructuring: false, // 数组解构强制类型注解
          arrowParameter: true, // 箭头函数参数不强制类型注解
          memberVariableDeclaration: true, // 类属性强制类型注解
          objectDestructuring: false, // 对象解构强制类型注解
          parameter: true, // 函数参数强制类型注解
          propertyDeclaration: true, // 类属性强制类型注解
          variableDeclaration: true, // 变量声明强制类型注解
          variableDeclarationIgnoreFunction: true, // 函数声明变量不强制类型注解
        },
      ],

      // Stylistic 规则保留
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: { delimiter: 'semi', requireLast: true },
          singleline: { delimiter: 'semi', requireLast: false },
          multilineDetection: 'brackets',
        },
      ],
      '@stylistic/brace-style': ['error', '1tbs'],
    },
  },
]);
