const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');

const insightsProxy = {
  https: false,
  ...(process.env.BETA && { deployment: 'beta/apps' }),
};

const hostname = process.env.API_HOSTNAME ?? 'localhost';

const webpackProxy = {
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  env: `${process.env.ENVIRONMENT || 'stage'}-${
    process.env.BETA ? 'beta' : 'stable'
  }`, // for accessing prod-beta start your app with ENVIRONMENT=prod and BETA=true
  appUrl: process.env.BETA ? ['/preview/edge', '/beta/edge'] : '/edge',
  ...(process.env.INSIGHTS_CHROME && {
    localChrome: process.env.INSIGHTS_CHROME,
  }),
  routes: {
    ...(process.env.API_PORT && {
      '/api/edge': { host: `http://${hostname}:${process.env.API_PORT}` },
    }),
    ...(process.env.CONFIG_PORT && {
      [`${process.env.BETA ? '/beta' : ''}/config`]: {
        host: `http://${hostname}:${process.env.CONFIG_PORT}`,
      },
    }),
  },
};

const deps = require('../package.json').dependencies;
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  useFileHash: false,
  sassPrefix: '.fleet-management, .edge',
  ...(process.env.PROXY ? webpackProxy : insightsProxy),
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
      exposes: {
        // Application root
        './RootApp': resolve(__dirname, '../src/AppEntry'),
        // expose System detail to be used on insights
        './Inventory': resolve(__dirname, '../src/Routes/Devices/Inventory.js'),
        './InventoryDetail': resolve(
          __dirname,
          '../src/Routes/DeviceDetail/DeviceDetail.js'
        ),
        './Images': resolve(__dirname, '../src/Routes/ImageManager/Images.js'),
        './ImagesSetTable': resolve(
          __dirname,
          '../src/Routes/ImageManager/ImageSetsTable.js'
        ),
        './ImagesDetail': resolve(
          __dirname,
          '../src/Routes/ImageManagerDetail/ImageDetail.js'
        ),

        './DeviceTable': resolve(
          __dirname,
          '../src/Routes/Devices/DeviceTable.js'
        ),
        './UpdateDeviceModal': resolve(
          __dirname,
          '../src/Routes/Devices/UpdateDeviceModal.js'
        ),
        './UpdateImageModal': resolve(
          __dirname,
          '../src/Routes/DeviceDetail/UpdateImageModal.js'
        ),
        './UpdateSystem': resolve(
          __dirname,
          '../src/Routes/Devices/UpdateSystem.js'
        ),
      },
      shared: [
        { 'react-redux': { requiredVersion: deps['react-redux'] } },
        { 'react-dom': { singleton: true, eager: true } },
        { '@patternfly/react-core': { singleton: true } },
      ],
      exclude: ['react-router-dom'],
    }
  )
);

webpackConfig.devServer.client.overlay = false;

module.exports = {
  ...webpackConfig,
  plugins,
};
