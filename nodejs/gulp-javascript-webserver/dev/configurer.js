'use strict';

module.exports = function (callback) {
  var isProduction = process.env.NODE_ENV === 'production';
  var config = {
    port: 4000,
    debug: {
      namespace: 'express-scaffolding'
    },
    cache:{
      views: isProduction ? 'memory' : false
    }
  };

  callback(null, config);
};
