const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: 'main'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js?[hash:8]',
    publicPath: "/"
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          enforce: true
        }
      }
    },
  },
  resolve: {
    modules: [
      path.resolve('node_modules'),
      path.resolve('src'),
    ],
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[hash:8]_[local]',
              url: true,
            },
          },
          'postcss-loader',
          'sass-loader'
        ],
        include: path.resolve('src'),
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
              localIdentName: '[hash:8]_[local]',
            },
          },
          'postcss-loader',
        ],
        include: [
          path.resolve('src'),
          path.resolve('node_modules/rmc-picker'),
        ],
      },
      {
        test: /\.(js)$/,
        use: 'babel-loader',
        include: path.resolve('src')
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html'
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src/assets'),
        to: path.resolve(__dirname, 'dist/assets')
      }
    ])
  ]
};

module.exports = config;