'use strict';

var gulp = require('gulp');
var gulpPlugins = require('gulp-load-plugins')();
var del = require('del');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');

var AUTOPREFIXER_BROWSERS = [
'ie >= 10',
'ie_mob >= 10',
'ff >= 30',
'chrome >= 34',
'safari >= 7',
'opera >= 23',
'ios >= 7',
'android >= 4.4',
'bb >= 10'
];

// Lint JavaScript
gulp.task('jslint-client', function () {
  return gulp.src(['dev/assets/scripts/**/*.js'])
  .pipe(browserSync.stream({ once: true }))
  .pipe(gulpPlugins.eslint())
  .pipe(gulpPlugins.eslint.format());
});

gulp.task('jslint-server', function () {
  return gulp.src(['dev/**/*.js', '!dev/public/**/*', '!dev/assets/**/*'])
  .pipe(browserSync.stream({ once: true }))
  .pipe(gulpPlugins.eslint())
  .pipe(gulpPlugins.eslint.format());
});

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function () {
  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'dev/assets/styles/*.scss',
    'dev/assets/styles/**/*.css'
  ])
  .pipe(gulpPlugins.changed('styles', { extension: '.scss' }))
  .pipe(gulpPlugins.sass({
    precision: 10,
    errLogToConsole: true
  }))
  .pipe(gulpPlugins.autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
  .pipe(gulp.dest('dev/public/styles'));
});

gulp.task('babel-compile-client', function () {
  return gulp.src('dev/assets/scripts/**/*.js')
  .pipe(gulpPlugins.plumber())
  .pipe(gulpPlugins.sourcemaps.init())
  .pipe(gulpPlugins.babel())
  .pipe(gulpPlugins.concat('bundle.js'))
  .pipe(gulpPlugins.sourcemaps.write('.'))
  .pipe(gulp.dest('dev/public/scripts'))
});

gulp.task('client-scripts', ['jslint-client', 'babel-compile-client']);

// Watch Files For Changes & Reload
gulp.task('dev', ['styles', 'client-scripts', 'jslint-server'], function () {
  browserSync({
    notify: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    online: true, // If it is not set and you're offline the server take 2 minutes to run
    open: false, // Don't open the browser windows with the url when staring
    reloadDelay: 800,
    proxy: 'localhost:4000',
    port: 4040
  });

  gulpPlugins.nodemon({
    execMap: {
      js: "babel-node --stage 0"
    },
    script: 'dev/index.js',
    ext: 'js',
    watch: ['dev'],
    ignore: ['dev/public', 'dev/assets']
  })
  .on('change', ['jslint-server'])
  .on('restart', browserSync.reload);

  gulp.watch(['dev/assets/styles/**/*.{scss,css}'], ['styles']);
  gulp.watch(['dev/assets/scripts/**/*.js'], ['client-scripts']);
  gulp.watch(['dev/public/**/*','dev/views/**/*'], browserSync.reload);
});

// Clean Output Directory
gulp.task('clean', del.bind(null, [ 'dist', '.sass-cache']));

// Build Production Files, the Default Task
gulp.task('build', ['clean'], function (cb) {
  runSequence(['client-scripts:dist', 'styles:dist', 'images', 'fonts', 'server:dist', 'processed-assets'], function (error) {
    if (error) {
      cb(error);
    } else {
      gulpPlugins.util.log('`dist` directory created with the processed source files');
      cb();
    }
  });
});


// Server scripts copy
gulp.task('babel-compile-server:dist', function () {
  return gulp.src(['dev/**/*.js', '!dev/assets/**/*'])
  .pipe(gulpPlugins.babel({ stage: 0, optional: ['runtime'] }))
  .pipe(gulp.dest('dist/build'))
});

gulp.task('server:dist', ['babel-compile-server:dist'], function () {
  return gulp.src([
    'dev/**/*',
    '!dev/**/*.js',
    '!dev/public{,/**}',
    '!dev/assets{,/**}'
  ])
  .pipe(gulp.dest('dist/build'))
  .pipe(gulpPlugins.size({ title: 'server' }));
});

// Copy processed assets
gulp.task('processed-assets', function () {
  return gulp.src([
    'dev/public/*',
    'dev/public/**/vendor/**/*'
  ])
  .pipe(gulp.dest('dist/build/public'))
  .pipe(gulpPlugins.size({ title: 'processed assets' }));
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src('dev/public/images/**/*')
  .pipe(gulpPlugins.cache(gulpPlugins.imagemin({
    progressive: true,
    interlaced: true
  })))
  .pipe(gulp.dest('dist/build/public/images'))
  .pipe(gulpPlugins.size({ title: 'images' }));
});

// Copy Web Fonts To Dist
gulp.task('fonts', function () {
  return gulp.src(['dev/public/fonts/**'])
  .pipe(gulp.dest('dist/build/public/fonts'))
  .pipe(gulpPlugins.size({ title: 'fonts' }));
});

// Client Scripts
// For client side no es7 options are set
gulp.task('babel-compile-client:dist', function () {
  return gulp.src('dev/assets/scripts/**/*.js')
  .pipe(gulpPlugins.babel())
  .pipe(gulpPlugins.concat('bundle.js'))
  .pipe(gulp.dest('dist/build/public/scripts'))
});

gulp.task('client-scripts:dist', ['jslint-client', 'babel-compile-client:dist'], function () {
  return gulp.src('dev/assets/scripts/bundle.js')
  .pipe(gulpPlugins.uglify('bundle.js'))
  .pipe(gulp.dest('dist/build/public/scripts'))
  .pipe(gulpPlugins.size({ title: 'scripts' }));
});

gulp.task('styles:dist', ['styles'], function () {
  return gulp.src('dev/public/styles/**/*.css')
  .pipe(gulpPlugins.csso())
  .pipe(gulp.dest('dist/build/public/styles'))
  .pipe(gulpPlugins.size({ title: 'styles' }));
});
