const { ModuleFederationPlugin } = require('webpack').container;
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

module.exports = {
  output: {
    publicPath: 'auto',
    uniqueName: 'veloceIntegrationHost',
  },
  optimization: {
    runtimeChunk: false,
  },
  experiments: {
    asyncWebAssembly: true,
  },
  module: {
    parser: {
      javascript: {
        // https://github.com/angular/angular-cli/issues/24617
        url: true,
      },
    },
  },
  plugins: [
    new FilterWarningsPlugin({
      exclude: [
        /Critical dependency: the request of a dependency is an expression/,
        /CommonJS or AMD dependencies can cause optimization bailouts/,
      ],
    }),
    new ModuleFederationPlugin({
      shared: {
        '@angular/animations': { singleton: true, eager: true, requiredVersion: '>=15.2.0' },
        '@angular/common': { singleton: true, eager: true, requiredVersion: '>=15.2.0' },
        '@angular/core': { singleton: true, eager: true, requiredVersion: '>=15.2.0' },
        '@angular/forms': { singleton: true, eager: true, requiredVersion: '>=15.2.0' },
        '@angular/platform-browser': { singleton: true, eager: true, requiredVersion: '>=15.2.0' },
        rxjs: { singleton: true, eager: true, requiredVersion: '>=7.8.0' },
      },
    }),
  ],
};
