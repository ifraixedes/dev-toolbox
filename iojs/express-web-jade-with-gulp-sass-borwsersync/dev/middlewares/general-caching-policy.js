'use strict';

module.exports = function (config) {
  let cacheValue = `max-age=${config.cache.pages}`;

  return function (req, res, next) {
    res.set('Cache-Control', cacheValue);
    next();
  };
};
