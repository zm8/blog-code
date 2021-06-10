const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/index',
  // 解决 browserslist 导致 webpack-dev-server 的自动刷新失效
  target: process.env.RUNTIME ? 'web' : 'browserslist',
  devServer: {
    publicPath: '/dist/',
    hot: true,
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: require.resolve('ts-loader'),
          options: {
            configFile: process.env.RUNTIME ? 'tsconfig.runtime.json' : 'tsconfig.json',
          },
        },
        exclude: path.resolve(__dirname, '../node_modules'),
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: path.resolve(__dirname, '../node_modules'),
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]___[hash:base64:5]',
              },
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
        exclude: path.resolve(__dirname, '../node_modules'),
      },
    ],
  },
  resolve: {
    mainFields: ['jsnext:main', 'browser', 'module', 'main'],
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [new webpack.EnvironmentPlugin(['ENV'])],
};
