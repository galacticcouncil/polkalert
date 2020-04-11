const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { TsConfigPathsPlugin } = require('awesome-typescript-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const clientConfig = require('./src/config/client-config.json')

module.exports = {
  resolve: {
    alias: {
      'styled-components': path.resolve(
        __dirname,
        'node_modules',
        'styled-components'
      ),
    },
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    plugins: [new TsConfigPathsPlugin()],
  },
  entry: ['./src/index.tsx'],
  module: {
    rules: [
      {
        test: /\.ts[x]?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    hot: true,
    inline: true,
    port: clientConfig.clientPort,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      filename: 'index.html',
    }),
    new CopyWebpackPlugin([
      {
        from: 'public',
        to: '.',
        ignore: ['README.md'],
      },
    ]),
  ],
}
