'use strict';

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

var app = require('./dev');

process.on('message', function (closeMsg) {
  switch (closeMsg) {
    case 'close':
      closeServer(function () {
        process.send('closed');
      });
      break;
    case 'start':
      startServer(function () {
        process.send('listening');
      });
  }
});

process.on('SIGTERM', exitProcess.bind(null, 0));
process.on('SIGINT', exitProcess.bind(null, 0));
