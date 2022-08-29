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
        '@angular/animations': { singleton: true, eager: false, requiredVersion: '>=12.2.0', import: false },
        '@angular/common': { singleton: true, eager: false, requiredVersion: '>=12.2.0', import: false },
        '@angular/core': { singleton: true, eager: false, requiredVersion: '>=12.2.0', import: false },
        '@angular/forms': { singleton: true, eager: false, requiredVersion: '>=12.2.0', import: false },
        '@angular/platform-browser': { singleton: true, eager: false, requiredVersion: '>=12.2.0', import: false },
        rxjs: { singleton: true, eager: false, requiredVersion: '>=7.3.0', import: false },
      },
    }),
  ],
};
