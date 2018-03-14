var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var pkg = require('./package.json');
var browserSync = require('browser-sync').create();

// Set the banner content
var banner = ['/*!\n',
  ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2018-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' */\n',
  ''
].join('');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function() {

  // Bootstrap
  gulp.src([
      './node_modules/bootstrap/dist/**/*',
      '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
      '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
    .pipe(gulp.dest('./dist/vendor/bootstrap'))

  // Font Awesome
  gulp.src([
      './node_modules/font-awesome/**/*',
      '!./node_modules/font-awesome/{less,less/*}',
      '!./node_modules/font-awesome/{scss,scss/*}',
      '!./node_modules/font-awesome/.*',
      '!./node_modules/font-awesome/*.{txt,json,md}'
    ])
    .pipe(gulp.dest('./dist/vendor/font-awesome'))

  // jQuery
  gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./dist/vendor/jquery'))

  // jQuery Easing
  gulp.src([
      './node_modules/jquery.easing/*.js'
    ])
    .pipe(gulp.dest('./dist/vendor/jquery-easing'))

  // Magnific Popup
  gulp.src([
      './node_modules/magnific-popup/dist/*'
    ])
    .pipe(gulp.dest('./dist/vendor/magnific-popup'))
});

// Compile SCSS
gulp.task('css:compile', function() {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function() {
  return gulp.src([
      './dist/css/*.css',
      '!./dist/css/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

// CSS
gulp.task('css', ['css:compile', 'css:minify']);

// Concat JavaScript
gulp.task('js:concat', function() {
  return gulp.src([
      './dist/vendor/jquery/jquery.min.js',
      './dist/vendor/bootstrap/js/bootstrap.bundle.min.js',
      './dist/vendor/jquery-easing/jquery.easing.min.js',
      './dist/vendor/magnific-popup/jquery.magnific-popup.min.js',
      './src/js/jqBootstrapValidation.js',
      './src/js/contact_me.js',
      './src/js/freelancer.min.js'
    ])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./dist/js/'));
});

// Minify JavaScript
gulp.task('js:minify', function() {
  return gulp.src([
      './dist/js/*.js',
      '!./dist/js/*.min.js'
    ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(browserSync.stream());
});

// JS
gulp.task('js', ['js:concat', 'js:minify']);

// Default task
gulp.task('default', ['css', 'vendor', 'js']);

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

// Dev task
gulp.task('dev', ['css', 'js', 'browserSync'], function() {
  gulp.watch('./src/scss/*.scss', ['css']);
  gulp.watch('./src/js/*.js', ['js']);
  gulp.watch('./*.html', browserSync.reload);
});
