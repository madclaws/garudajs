var webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var path = require('path');

module.exports = {
  entry: {
    'garuda': './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, '_bundles'),
    filename: 'garuda.js',
    libraryTarget: 'umd',
    library: 'Garuda',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  // optimization: {
  //   minimizer: [
  //     // we specify a custom UglifyJsPlugin here to get source maps in production
  //     new UglifyJsPlugin({
  //       cache: true,
  //       parallel: true,
  //       uglifyOptions: {
  //         compress: false,
  //         ecma: 6,
  //         mangle: true
  //       },
  //       sourceMap: true
  //     })
  //   ]
  // },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'awesome-typescript-loader',
      exclude: /node_modules/,
      query: {
        declaration: false,
      }
    }]
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
  },
  mode: 'development'
};
