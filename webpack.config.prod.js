const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      name: 'MuiFileUploaderPro',
      type: 'umd',
    },
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          }
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: [
    ({ request }, callback) => {
      // Regex to match any import starting with these package names
      if (/^@mui\//.test(request) || 
          /^@emotion\//.test(request) || 
          /^react($|\/)/.test(request) || 
          /^react-dom($|\/)/.test(request)) {
        return callback(null, `commonjs ${request}`);
      }
      callback();
    },
  ],
  devtool: false,
};
