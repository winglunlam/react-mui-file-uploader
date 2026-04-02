const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './example/App.tsx',
  output: {
    // We use 'dist-demo' to avoid clashing with your library's 'dist'
    path: path.resolve(__dirname, 'dist-demo'),
    filename: 'bundle.[contenthash].js',
    publicPath: '/mui-file-uploader-pro/', 
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './example/index.html',
    }),
  ],
};