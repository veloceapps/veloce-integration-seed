const localAuthInfo = (() => {
  try {
    return require('./local/auth.json');
  } catch {
    return;
  }
})();

const serverUrl = localAuthInfo?.serverUrl ?? 'http://localhost:8083';

const proxyInfo = {
  '/services/*': serverUrl,
};

const baseConfig = {
  secure: true,
  changeOrigin: true,
  logLevel: 'info', // ['debug', 'info', 'warn', 'error', 'silent']
  headers: {
    Origin: 'https://localhost.force.com',
    Connection: 'keep-alive',
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
