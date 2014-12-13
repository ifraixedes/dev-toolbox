'use strict';

var path = require('path');
var http = require('http');
var express = require('express');
var swig = require('swig');
var debug = require('debug');
var routesConfigurer = require('./routes');
var middlewares = require('./middlewares');

var server = null;

function start(config, callback) {
  var expressApp = express();
  var routes = routesConfigurer(config);
  debug = debug(config.debug.namespace + ':server');

  middlewares = middlewares(config);
  server = http.createServer(expressApp);
  expressApp.engine('swig', swig.renderFile);
  expressApp.set('view engine', 'swig');
  expressApp.set('views', path.join(__dirname, 'views'));
  expressApp.set('etag', 'weak');
  swig.setDefaults({ cache: config.cache.views });

  // Pre-routing middleware
  expressApp.use('/styles', express.static(path.join(__dirname, 'public/styles')));
  expressApp.use('/scripts', express.static(path.join(__dirname, 'public/scripts')));
  expressApp.use('/images', express.static(path.join(__dirname, 'public/images')));
  expressApp.use('/fonts', express.static(path.join(__dirname, 'public/fonts')));
  expressApp.use(middlewares.generalCachingPolicy);


  Object.keys(routes).forEach(function (route) {
    expressApp.use('/' + route, routes[route]);
  });

  // Post-send middleware
  expressApp.use(middlewares.errorHandler);

  server.listen(config.port, config.ipAddress, function () {
    if (config.ipAddress) {
      debug('Server running on port %s:%s', config.ipAddress, config.port);
    } else {
      debug('Server running on port %s', config.port);
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
      setInmediate(callback());
    }
  }
}

module.exports = {
  start: start,
  stop: stop
};
