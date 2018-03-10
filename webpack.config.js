const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// ELECTRON_RENDERER_PROCESS_ROOT
const root = path.resolve(__dirname, 'src/renderer/')

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@root': path.resolve(root),
    },
    extensions: ['.js', '.jsx'],
  },
}
