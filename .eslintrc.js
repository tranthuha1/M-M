module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/vue3-essential', '@vue/airbnb', '@vue/typescript/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // allow Module Federation
    'import/no-unresolved': [2, { ignore: ['^tcctxh_base/.*$'] }],
    'import/prefer-default-export': 'off',
    // vue
    'vue/multi-word-component-names': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    // ts
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    'max-len': 'off',
    camelcase: 'off',
    '@typescript-eslint/camelcase': 'off',
    'linebreak-style': 0,
    'vue/no-unsupported-features': 'off',
  },
};
