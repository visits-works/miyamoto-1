// webpack-test.config.js

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  devtool: false,
  target: 'node',
  externals: [nodeExternals(), 'QUnit'],
  entry: {
    main: './tests/index.test.ts',
  },
  output: {
    path: __dirname,
    filename: 'test-bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  node: {
    fs: 'empty',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          ignoreDiagnostics: [7005, 7006, 7053],
          compilerOptions: {
            module: 'commonjs',
            noImplicitReturns: true,
            noUnusedLocals: true,
            esModuleInterop: true,
            strict: true,
            target: 'es2017',
            lib: ['ES2019', 'ES2020.String'],
            types: [
              '@types/google-apps-script',
              '@types/node',
              '@types/webpack-env',
            ],
          },
        },
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
