const path = require('path');

module.exports = (storybookBaseConfig, configType, defaultConfig) => {
  defaultConfig.resolve = {
    modules: [
      path.resolve('node_modules'),
      path.resolve('src'),
    ],
    extensions: ['.js'],
  };

  defaultConfig.module.rules.push({
    test: /\.scss$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[hash:8]_[local]',
        },
      },
      'postcss-loader',
      'sass-loader'
    ],
  });

  return defaultConfig;
};