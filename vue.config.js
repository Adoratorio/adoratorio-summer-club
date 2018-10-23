const path = require('path');

module.exports = {
  baseUrl: '/',
  outputDir: undefined,
  assetsDir: 'static',
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  css: undefined,

  pwa: {
    appleMobileWebAppStatusBarStyle: 'black',
    workboxOptions: {
      navigateFallback: '/index.html',
    },
  },

  chainWebpack: (config) => {
    config.resolve.alias.set('@modernizr$', path.resolve(__dirname, './src/assets/lib/modernizr.js'));
  },
};
