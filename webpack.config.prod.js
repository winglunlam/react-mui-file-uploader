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
  externals: {
    'react': 'react',
    'react-dom': 'react-dom',
    '@mui/material': '@mui/material',
    '@mui/material/styles': '@mui/material/styles',
    '@emotion/react': '@emotion/react',
    '@emotion/styled': '@emotion/styled',
  },
  devtool: false,
};
