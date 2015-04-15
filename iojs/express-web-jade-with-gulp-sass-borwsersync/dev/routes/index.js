'use strict';

let router = require('express').Router;

function homeRouter(config) {
  let debug = require('debug')(`${config.debug.namespace}:route:home`);
  let homeRoute = router();

  homeRoute.get('/', function home(req, res) {
    debug('requested');
    res.render('home', { msg: 'Message from Server' });
  });

  return homeRoute;
}

module.exports = function (config) {
  return {
    '': homeRouter(config)
  };
};
