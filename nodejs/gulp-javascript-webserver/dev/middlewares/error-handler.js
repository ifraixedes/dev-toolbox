'use strict';

module.exports = function (config) {
  return function (error, req, res, next) {
    // TODO setup logger
    console.error(error.stack);
    res.json({ status: 'error', message: error.message });
  };
};
