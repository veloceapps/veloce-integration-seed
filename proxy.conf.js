const proxyInfo = (() => {
  try {
    return require('./local/auth.json').proxy;
  } catch {
    return {
      '/services/*': 'http://localhost:8083',
    };
  }
})();

const baseConfig = {
  secure: true,
  changeOrigin: true,
  logLevel: 'info', // ['debug', 'info', 'warn', 'error', 'silent']
  headers: {
    Origin: 'https://localhost.force.com',
  },
};

const proxyConfig = Object.keys(proxyInfo).reduce((trunk, key) => {
  return {
    ...trunk,
    [key]: {
      ...baseConfig,
      target: proxyInfo[key],
    },
  };
}, {});

module.exports = proxyConfig;
