const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  return config;
});

module.exports = composePlugins(withNx(), withReact(), (config) => {
  config.module.rules.push({
    test: /\.(mp3)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/sounds/', // Adjust the output path as needed
        },
      },
    ],
  });

  return config;
});
