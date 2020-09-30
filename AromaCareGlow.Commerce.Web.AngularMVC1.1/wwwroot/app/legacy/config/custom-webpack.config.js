
var AuthenticationPlugin = require('./authentication.js');
const webpack = require('webpack');

module.exports = {
  plugins: [
    new AuthenticationPlugin(process.env.NODE_ENV),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
}

