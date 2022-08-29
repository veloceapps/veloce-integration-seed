const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  output: {
    publicPath: 'auto',
    uniqueName: 'demoConfiguration',
  },
  optimization: {
    runtimeChunk: false,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'demoConfiguration',
      filename: 'remoteDemoConfiguration.js',
      exposes: {
        RootModule: './apps/demo/src/app/root.module.ts',
      },
      shared: {
        '@angular/animations': { singleton: true, eager: false, requiredVersion: '>=12.2.0' },
        '@angular/common': { singleton: true, eager: false, requiredVersion: '>=12.2.0' },
        '@angular/core': { singleton: true, eager: false, requiredVersion: '>=12.2.0' },
        '@angular/forms': { singleton: true, eager: false, requiredVersion: '>=12.2.0' },
        '@angular/platform-browser': { singleton: true, eager: false, requiredVersion: '>=12.2.0' },
        rxjs: { singleton: true, eager: false, requiredVersion: '>=7.3.0' },
      },
    }),
  ],
};
