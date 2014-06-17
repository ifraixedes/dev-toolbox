'use strict';

var path = require('path');
var http = require('http');
var express = require('express');
var consolidate = require('consolidate');
var routesConfigurer = require('./routes');
var middlewares = require('./middlewares');

var server = null;

function start(config, callback) {
  var expressApp = express();
  var routes = routesConfigurer(config);

  server = http.createServer(expressApp);
  expressApp.engine('html', consolidate.swig);
  expressApp.set('view engine', 'html');
  expressApp.set('views', path.join(__dirname, 'views'));
  expressApp.use(express.static(path.join(__dirname, 'public')));

  for (var route in routes) {
    expressApp.use('/' + route, routes[route]);
  }

  expressApp.use(middlewares.errorHandler);

  server.listen(config.port, config.ipAddress, function () {
    if (config.ipAddress) {
      console.info('Server running on port %s:%s', config.ipAddress, config.port);
    } else {
      console.info('Server running on port %s', config.port);
    }

    if (callback) {
      callback();
    }
  });
}

function stop(callback) {
  if (server) {
    server.close(callback);
    server = null;
  } else {
    if (callback) {
      callback();
    }
  }
}

module.exports = {
  start: start,
  stop: stop
};
