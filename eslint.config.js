import eslint from '@eslint/js'
import vue from 'eslint-plugin-vue'
import accessibility from 'eslint-plugin-vuejs-accessibility'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['**/dist/**', '**/es/**', '**/node_modules/**', '**/coverage/**', 'docs/.vitepress/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser, ecmaVersion: 'latest', sourceType: 'module' }
    }
  },
  ...accessibility.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/first-attribute-linebreak': 'off',
      // 以下 vuejs-accessibility 规则基于静态分析，无法识别动态 :tabindex / roving tabindex /
      // aria-activedescendant / 遮罩点击 + Esc 关闭等复杂 ARIA 模式，会误报；
      // 无障碍能力已由 vitest-axe 运行时校验（toHaveNoViolations）覆盖。
      'vuejs-accessibility/click-events-have-key-events': 'off',
      'vuejs-accessibility/no-static-element-interactions': 'off',
      'vuejs-accessibility/interactive-supports-focus': 'off',
      'vuejs-accessibility/label-has-for': 'off'
    }
  }
)