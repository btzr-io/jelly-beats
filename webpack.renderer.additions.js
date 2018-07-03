const path = require('path')
const source = path.resolve(__dirname, 'src')

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
    alias: {},
    extensions: ['.js', '.jsx'],
  },
}
