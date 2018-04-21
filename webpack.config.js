const path = require('path');

module.exports = {
  entry: './scripts/app.js',
  output: {
    path: path.join(__dirname, 'scripts'),
    filename: './bundle.js'
  },
  module: {
    rules: [{
      loader: 'babel-loader',
      test: /\.js$/,
      exclude: /node_modules/
    }]
  }
};
