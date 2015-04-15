'use strict';

module.exports = function (config) {
  let logger = config.logger;

  return function (error, req, res) {
    logger.error(error.stack);

    if (config.env === 'production') {
      res.render('error');
    } else {
      res.render('error', { message: error.message });
    }
  };
};
