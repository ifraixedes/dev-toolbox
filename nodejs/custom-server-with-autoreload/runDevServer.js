'use strict';

var app = require('./dev');

function closeServer(callback) {
  var closeTimeoutId;

  if (!callback) {
    callback = function () {};
  }

  closeTimeoutId = setTimeout(callback, 500);

  app.stop(function () {
    clearTimeout(closeTimeoutId);
    callback();
  });
}

function startServer(callback) {
  closeServer(function () {
    app.start(callback);
  });
}

function exitProcess(numCode) {
  closeServer(function () {
    process.exit(numCode);
  });
}

process.on('message', function (closeMsg) {
  switch (closeMsg) {
    case 'close':
      closeServer(function (error) {
        if (error) {
          process.send({ event: 'error', details: error.message });
        } else {
          process.send({ event: 'closed' });
        }
      });
      break;
    case 'start':
      startServer(function (error) {
        if (error) {
          process.send({ event: 'error', details: error.message });
        } else {
          process.send({ event: 'listening' });
        }
      });
  }
});

process.on('SIGTERM', exitProcess.bind(null, 0));
process.on('SIGINT', exitProcess.bind(null, 0));
