'use strict';

module.exports =  function errorHandler(error, req, res, next) {
  res.json({ status: 'error', message: error.message });
};

