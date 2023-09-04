const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("node:path");

module.exports = {
  mode: process.env['NODE_ENV'],
  entry: "./src/tldraw/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist/tldraw"),
    filename: 'tldraw.js',
    publicPath: './',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.m?js$/i,
        resolve: {
          fullySpecified: false,
        }
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      template: path.resolve(__dirname, './src/tldraw/index.html'),
      filename: 'index.html',
    }),
  ],
}
