/*
 * @Author: songxiaolin songxiaolin@aixuexi.com
 * @Date: 2023-03-23 11:57:00
 * @LastEditors: songxiaolin songxiaolin@aixuexi.com
 * @LastEditTime: 2023-06-06 11:27:45
 * @FilePath: /penCorrectPlayer/rollup.config.ts
 * @Description:
 */
// @ts-nocheck
import path from 'path'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

import pkg from './package.json'

// resolve公共方法
const resolve = (p) => path.resolve(__dirname, p)

// 插件
const plugins = [
  commonjs(),
  nodeResolve(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: true,
    declarationDir: 'types',
  }),
  json(),
  babel({
    presets: ['@babel/preset-env'],
    exclude: 'node_modules/**',
    extensions: ['.js'],
  }),
]
// 输出配置
const outputConfigs = {
  'esm-bundler': {
    file: resolve(`dist/${pkg.filename}.esm-bundler.js`),
    format: `es`,
  },
  cjs: {
    file: resolve(`dist/${pkg.filename}.cjs.js`),
    format: `cjs`,
  },
  global: {
    file: resolve(`dist/${pkg.filename}.global.js`),
    format: `iife`,
  },
}
const defaultFormats = ['esm-bundler', 'cjs', 'global']
const packageConfigs = []

function createConfig(format, plugins = []) {
  const isGlobalBuild = /global/.test(format)

  // 不需要参与bundle的第三方包
  function resolveExternal() {
    if (isGlobalBuild) return []

    return [
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.dependencies || {}),
    ]
  }

  return {
    input: 'src/index.ts',
    external: resolveExternal(),
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'types',
      }),
      json(),
      babel({
        presets: ['@babel/preset-env'],
        exclude: 'node_modules/**',
        extensions: ['.js'],
      }),
      terser({
        module: /^esm/.test(format),
        compress: {
          ecma: 2015,
          pure_getters: true,
          drop_console: true,
        },
        safari10: true,
      }),
      ...plugins,
    ],
    output: {
      ...outputConfigs[format],
      name: 'PenPlayer',
    },
    treeshake: {
      moduleSideEffects: false,
    },
  }
}

defaultFormats.forEach((format) => {
  packageConfigs.push(createConfig(format))
})

module.exports = packageConfigs
