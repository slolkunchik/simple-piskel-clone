const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpg|svg|ttf|eot|woff|woff2|ico)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },
  entry: {
    piskel: './app.js',
    landing: './landing/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'script/[name]/bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: path.resolve(__dirname, 'src/view/index.html'),
      chunks: ['piskel'],
      filename: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name]/style.css',
    }),
    new CopyPlugin([
      {
        from: 'gif.worker.js',
        to: './',
      },
    ]), // landing
    new HtmlWebpackPlugin({
      hash: true,
      template: path.resolve(__dirname, 'landing/index.html'),
      filename: './landing.html',
      chunks: ['landing'],
    }),
    new CopyPlugin([
      {
        from: 'landing/css/*.css',
        to: '.',
      },
      {
        from: 'landing/img/**',
        to: '.',
      },
      {
        from: 'landing/vendor/**',
        to: '.',
      },
    ]),
  ],
};
