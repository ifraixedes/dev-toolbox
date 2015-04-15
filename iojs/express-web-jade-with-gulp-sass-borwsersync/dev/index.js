'use strict';

let configurer = require('./configurer');
let server = require('./server');

// If module is executed then run the sever
// otherwise export the functionalities
if (require.main === module) {
  bootstrapper(function (error) {
    if (error) {
      console.error('Server FAILURE', error);
      /* eslint-disable no-process-exit */
      process.exit(1);
      /* eslint-enable no-process-exit */
    }
  });
  return;
}

function reportInvalidOperation(error) {
  return function (callback) {
    callback(error);
  };
}

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
