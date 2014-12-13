'use strict';

module.exports = function (config) {
  return function (req, res, next) {
    res.set('Cache-Control', 'max-age=3600');
    next();
  };
};
