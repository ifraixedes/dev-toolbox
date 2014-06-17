'use strict';

var configurer = require('./configurer');
var server = require('./server');

function reportInvalidOperation(error) {
  return function (callback) {
    callback(error);
  };
};

function start(config, callback) {
  module.exports.start = reportInvalidOperation(new Error('server is starting'));
  server.start(config, function (error) {
    if (error) {
      module.exports.start = bootstrapper;
      callback(error);
    } else {
      module.exports.stop = stop;
      module.exports.start = reportInvalidOperation(new Error('server is already running'));
      callback();
    }
  });
}

function stop(callback) {
  module.exports.stop = reportInvalidOperation(new Error('server is stopping'));
  server.stop(function (error) {
    if (error) {
      module.exports.stop = stop;
      callback(error);
    } else {
      module.exports.start = bootstrapper;
      module.exports.stop = reportInvalidOperation(new Error('Server is not started'));
      callback(error);
    }
  });
}

function bootstrapper(callback) {
  configurer(function (error, config) {
    if (error) {
      callback(error);
    } else {
      start(config, callback);
    }
  });
}

module.exports = {
  start: bootstrapper,
  stop: reportInvalidOperation(new Error('Server is not started'))
};
