// webpack.config.js
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: false,
  target: 'node10.13',
  entry: {
    main: './scripts/main.ts',
  },
  output: {
    path: __dirname,
    filename: 'main.gs',
    library: {
      type: 'commonjs',
    },
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
    new webpack.BannerPlugin({
      banner: `Miyamoto-san https://github.com/masuidrive/miyamoto/
(c) masuidrive 2014- License: MIT
-------------------`,
    }),
  ],
};
