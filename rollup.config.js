/*
 * @Author: songxiaolin songxiaolin@aixuexi.com
 * @Date: 2023-03-23 11:57:00
 * @LastEditors: songxiaolin songxiaolin@aixuexi.com
 * @LastEditTime: 2023-03-23 16:04:01
 * @FilePath: /penCorrectPlayer/rollup.config.js
 * @Description: 
 */
const babel = require('@rollup/plugin-babel');
const json = require('@rollup/plugin-json');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

const pkg = require('./package.json');
const plugins = [
	resolve(), // so Rollup can find `ms`
	commonjs(), // so Rollup can convert `ms` to an ES module
	json(),
	babel({
		presets: ['@babel/preset-env'],
		exclude: 'node_modules/**',
		extensions: ['.js', '.vue']
	}),
]

module.exports = [
// browser-friendly UMD build
	{
		input: 'src/index.js',
		output: {
			name: 'pencorrectplayer',
			file: pkg.browser,
			format: 'umd',
			banner: '/*eslint-disable */',
		},
		plugins
	},
	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/index.js',
		external: ['ms'],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
	}
]