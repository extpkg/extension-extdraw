const CopyPlugin = require('copy-webpack-plugin')
const path = require('node:path')

module.exports = {
  mode: process.env['NODE_ENV'],
  entry: './src/ext/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    clean: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/icons', to: 'icons' },
        { from: 'src/ext/manifest.json', to: 'manifest.json' },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
}
