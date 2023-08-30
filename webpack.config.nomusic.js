const path = require('path');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  entry: './build/bundle.nomusic.js',
  output: {
    filename: 'bundle.nomusic.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new WebpackObfuscator({
      rotateStringArray: true
    })
  ],
};
