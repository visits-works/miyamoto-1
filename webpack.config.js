// webpack.config.js
const webpack = require('webpack');
const GasPlugin = require('./tools/webpack-plugins/gas-webpack-plugin.js');

module.exports = {
  mode: 'development',
  devtool: false,
  target: 'node',
  entry: {
    main: './scripts/main.ts',
  },
  output: {
    path: __dirname,
    filename: 'main.gs',
    libraryTarget: 'commonjs',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
  plugins: [
    new GasPlugin({
      // autoGlobalExportsFiles: ['./scripts/main.ts'],
    }),
    new webpack.BannerPlugin({
      banner: `var exports = {};`,
      raw: true,
      entryOnly: true,
    }),
    new webpack.BannerPlugin({
      banner: `Miyamoto-san https://github.com/masuidrive/miyamoto/
(c) masuidrive 2014- License: MIT
-------------------`,
    }),
  ],
};
