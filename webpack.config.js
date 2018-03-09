const path = require('path')
// ELECTRON_RENDERER_PROCESS_ROOT
const root = path.resolve(__dirname, 'src/renderer/')
console.log(path.resolve(root, 'utils'))

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    alias: {
      '@utils': path.resolve(root, 'utils'),
    },
    extensions: ['.js', '.jsx'],
  },
}
