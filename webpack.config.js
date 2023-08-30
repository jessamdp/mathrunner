const path = require('path');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  entry: './build/bundle.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new WebpackObfuscator({
      rotateStringArray: true
    })
  ],
};
