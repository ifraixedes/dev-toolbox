'use strict';

var cpFork = require('child_process').fork;
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var gLiveReload = require('gulp-livereload');
var serverChildProc ;

var projectPaths = {
  server: [path.join(__dirname, 'dev/**/*'), '!' + path.join(__dirname, 'dev/public/**/*')],
  browser: path.join(__dirname, 'dev/public/**/*')
};

gulp.task('default', function () {
  gutil.log('I don\'t have a default task because you haven\'t defined any and I don\'t want to make any assumption');
});

gulp.task('server', function (next) {
  function startServer() {
    serverChildProc = cpFork('./runDevServer');
    serverChildProc.on('message', function (message) {
      if ('listening' === message.event) {
        gLiveReload.changed();
        next();
      }

      if ('error' === message.event)  {
        gutil.log(gutil.colors.red('Error on start server:', message.details));
      }
    });
    serverChildProc.send('start');
  }

  if (serverChildProc) {
    serverChildProc.on('message', function (message) {
      if ('closed' === message.event) {
        serverChildProc.kill('SIGTERM');
      }

      if ('error' === message.event)  {
        gutil.log(gutil.colors.red('Error on start server:', message.details));
      }
    });
    serverChildProc.on('exit', startServer);
    serverChildProc.send('close');
  } else {
    startServer();
  }

});

gulp.task('dev', ['server'], function (next) {
  gLiveReload.listen();
  gulp.watch(projectPaths.server, ['server']);
  gulp.watch(projectPaths.browser, gLiveReload.changed);
});
