const { ModuleFederationPlugin } = require('webpack').container;
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

module.exports = {
  output: {
    publicPath: 'auto',
    uniqueName: 'demoConfiguration',
  },
  optimization: {
    runtimeChunk: false,
  },
  module: {
    exprContextCritical: false,
    parser: {
      javascript: {
        // https://github.com/angular/angular-cli/issues/24617
        url: true,
      },
    },
  },
  experiments: {
    outputModule: true,
  },
  plugins: [
    new FilterWarningsPlugin({
      exclude: [
        /Critical dependency: the request of a dependency is an expression/,
        /CommonJS or AMD dependencies can cause optimization bailouts/,
      ],
    }),
    new ModuleFederationPlugin({
      library: { type: 'module' },
      name: 'demoConfiguration',
      filename: 'remoteDemoConfiguration.js',
      exposes: {
        RootModule: './apps/demo/src/app/root.module.ts',
      },
      shared: {
        '@angular/animations': { singleton: true, eager: false, requiredVersion: '>=15.2.0', import: false },
        '@angular/common': { singleton: true, eager: false, requiredVersion: '>=15.2.0', import: false },
        '@angular/core': { singleton: true, eager: false, requiredVersion: '>=15.2.0', import: false },
        '@angular/forms': { singleton: true, eager: false, requiredVersion: '>=15.2.0', import: false },
        '@angular/platform-browser': { singleton: true, eager: false, requiredVersion: '>=15.2.0', import: false },
        '@veloceapps/api': { singleton: true, eager: false, requiredVersion: '>=8.0.0-0', import: false },
        '@veloceapps/sdk/core': { singleton: true, eager: false, requiredVersion: '>=8.0.0-0', import: false },
        '@veloceapps/sdk/cms': { singleton: true, eager: false, requiredVersion: '>=8.0.0-0', import: false },
        '@veloceapps/sdk': { singleton: true, eager: false, requiredVersion: '>=8.0.0-0', import: false },
        rxjs: { singleton: true, eager: false, requiredVersion: '>=7.8.0', import: false },
      },
    }),
  ],
};
