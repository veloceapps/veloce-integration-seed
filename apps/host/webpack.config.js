const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  output: {
    publicPath: 'auto',
    uniqueName: 'veloceIntegrationHost',
  },
  optimization: {
    runtimeChunk: false,
  },
  plugins: [
    new ModuleFederationPlugin({
      shared: {
        '@angular/animations': { singleton: true, eager: true, requiredVersion: 'auto' },
        '@angular/common': { singleton: true, eager: true, requiredVersion: 'auto' },
        '@angular/core': { singleton: true, eager: true, requiredVersion: 'auto' },
        '@angular/forms': { singleton: true, eager: true, requiredVersion: 'auto' },
        rxjs: { singleton: true, eager: true, requiredVersion: 'auto' },
      },
    }),
  ],
};
