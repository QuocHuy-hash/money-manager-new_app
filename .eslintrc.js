module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off', // Tắt cảnh báo import React khi dùng JSX
    '@typescript-eslint/no-unused-vars': 'off', // Tắt cảnh báo biến không được sử dụng
    '@typescript-eslint/no-explicit-any': 'off', // Tắt cảnh báo khi sử dụng 'any'
    'react-hooks/rules-of-hooks': 'error', // Bật cảnh báo lỗi khi vi phạm hook rules
    'react-hooks/exhaustive-deps': 'warn', // Cảnh báo phụ thuộc của hook chưa đúng
    'quotes': ['off', 'single'], // Tắt cảnh báo về dấu nháy
    '@typescript-eslint/quotes': ['off', 'single'], // Tắt cảnh báo dấu nháy trong TypeScript
    'no-console': 'off', // Tắt cảnh báo khi dùng console.log
    'no-shadow': 'off', // Tắt cảnh báo biến trùng tên
    'react/no-unstable-nested-components': 'off', // Tắt cảnh báo về nested components trong React
    '@typescript-eslint/ban-ts-comment': 'off', // Tắt cảnh báo khi dùng @ts-ignore
    'operator-linebreak': 'off', // Tắt cảnh báo về dấu toán tử nằm ở cuối hoặc đầu dòng
    'eqeqeq': 'off', // Tắt cảnh báo về việc sử dụng '==' hoặc '!=' thay vì '===' hoặc '!=='.
    'space-infix-ops': 'off', // Tắt cảnh báo khoảng trắng xung quanh toán tử (như `a+b` thay vì `a + b`)
    'no-mixed-operators': 'off', // Tắt cảnh báo khi kết hợp nhiều toán tử khác nhau (như && và ||)
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
