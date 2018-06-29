const path = require('path')
const source = path.resolve(__dirname, 'src')
const root = path.resolve(source, 'renderer')

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      },
      {
        test: /\.css.module$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { modules: true },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@root': root,
    },
    extensions: ['.js', '.jsx'],
  },
}
