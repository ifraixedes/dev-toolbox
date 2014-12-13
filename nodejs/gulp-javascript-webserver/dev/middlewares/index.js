'use strict';

module.exports = function (config) {
  return {
    errorHandler: require('./error-handler')(config),
    generalCachingPolicy: require('./general-caching-policy')(config)
  };
};
