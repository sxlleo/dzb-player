/*
 * @Author: songxiaolin songxiaolin@aixuexi.com
 * @Date: 2022-09-15 11:26:34
 * @LastEditors: songxiaolin songxiaolin@aixuexi.com
 * @LastEditTime: 2023-05-31 15:23:48
 * @FilePath: /penCorrectPlayer/.eslintrc.cjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

/* eslint-env node */
module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        tabWidth: 2,
        singleQuote: true
      }
    ],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/ban-ts-comment': 'off'
  },
  ignorePatterns: ['demo', 'dist', 'node_modules']
}
