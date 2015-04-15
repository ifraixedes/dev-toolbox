'use strict';

let winston = require('winston');

module.exports = function (callback) {
  let env = getEnvVariables();
  //let isProduction = env.node === 'production';

  let config = {
    env: env.node,
    port: env.port,
    debug: {
      namespace: 'hack'
    },
    middlewares: {
      logger: {
        format: 'combined'
      }
    },
    logger: winston,
    cache: {
      pages: 3600
    }
  };

  callback(null, config);
};

function getEnvVariables() {
  let env = process.env;
  return {
    node: env.NODE_ENV,
    port: env.IFC_PORT || 4000
  };
}
