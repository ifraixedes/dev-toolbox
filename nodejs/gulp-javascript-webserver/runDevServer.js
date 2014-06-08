'use strict';

function closeServer(callback) {
  var closeTimeoutId;

  if (!callback) {
    callback = function () {};
  }

  closeTimeoutId = setTimeout(callback, 500);

  server.stop(function () {
    clearTimeout(closeTimeoutId);
    callback();
  });
}

function startServer(options, callback) {
  closeServer(function () {
    server.start(options, callback);
  });
}

function exitProcess(numCode) {
  closeServer(function () {
    process.exit(numCode);
  });
}

var server = require('./dev/server');

process.on('message', function (closeMsg) {
  switch (closeMsg) {
    case 'close':
      closeServer(function () {
        process.send('closed');
      });
      break;
    case 'start':
      startServer({ port: 4000 }, function () {
        process.send('listening');
      });
  }
});

process.on('SIGTERM', exitProcess.bind(null, 0));
process.on('SIGINT', exitProcess.bind(null, 0));
