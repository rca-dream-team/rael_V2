module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'prettier/prettier': 'warn',
    'no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
  ignorePatterns: ['node_modules', 'dist', 'build', '.next'],
}; 