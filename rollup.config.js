/*
 * @Author: songxiaolin songxiaolin@aixuexi.com
 * @Date: 2023-03-23 11:57:00
 * @LastEditors: songxiaolin songxiaolin@aixuexi.com
 * @LastEditTime: 2023-03-29 15:08:31
 * @FilePath: /penCorrectPlayer/rollup.config.js
 * @Description: 
 */
const path = require('path')
const babel = require('@rollup/plugin-babel');
const json = require('@rollup/plugin-json');
const nodeResolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

const pkg = require('./package.json');

// resolve公共方法
const resolve = p => path.resolve(__dirname, p)

const plugins = [
	nodeResolve(),
	commonjs(),
	json(),
	babel({
		presets: ['@babel/preset-env'],
		exclude: 'node_modules/**',
		extensions: ['.js']
	}),
]
const outputConfigs = {
  'esm-bundler': {
    file: resolve(`dist/${pkg.filename}.esm-bundler.js`),
    format: `es`
  },
  cjs: {
    file: resolve(`dist/${pkg.filename}.cjs.js`),
    format: `cjs`
  },
}

// 不需要参与bundle的第三方包
function resolveExternal(){
	return [
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.devDependencies || {})
	]
}

module.exports = [
	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/index.js',
		external: resolveExternal(),
		plugins,
		output: Object.values(outputConfigs),
	}
]