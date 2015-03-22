'use strict';

var homeRouter = require('express').Router();

homeRouter.get('/', function home(req, res, next) {
  res.render('home', { msg: 'Message from Server' });
});

module.exports = function (config) {
  return {
    '': homeRouter
  }
};
