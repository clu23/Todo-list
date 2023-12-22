const path = require('path');

module.exports = { 
  mode: "production",
  entry: './src/index.js',
  module: {
    rules: [
      { test: /\.css$/, use: "css-loader" }
    ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

