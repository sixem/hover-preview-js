'use strict';

const webpack = require('webpack');
const moment = require('moment');
const pack = require('./package.json');

const dev = process.env.NODE_ENV === 'development';

const banner = () =>
{
	return `${pack.name} v${pack.version} - ${pack.description}
Copyright ${pack.author} (c) ${moment().format('YYYY')} [${pack.homepage}]
Build: ${moment().format('YYYY-MM-DD')} ([hash])
License: ${pack.license}`;
};

module.exports = {
	mode: dev ? 'development' : 'production',
	context: __dirname + '/src',
	entry: './index.js',
	output: {
		path: __dirname + '/dist',
		filename: 'hover-preview' + (!dev ? '.min' : '') + '.js',
		library: 'hoverPreview',
		libraryTarget: 'umd',
		libraryExport: 'default'
	},
	optimization : {
		minimize : dev ? false : true
	},
	plugins : [
		new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.BannerPlugin({
			banner: banner(),
			entryOnly: true
		}),
	],
	module: {
		rules : [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components|vendors)/,
				use: {
					loader: 'babel-loader',
					options:
					{
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	}
};