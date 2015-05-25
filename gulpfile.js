'use strict';

var gulp = require('gulp');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var shell = require('gulp-shell');

gulp.task('build', function(){
  gulp.src('src/*.es6')
    .pipe(plumber({
      errorHandler: notify.onError()
    }))
    .pipe(babel())
    .pipe(gulp.dest('./'));
});

gulp.task('test', ['build'], shell.task([
  'npm test'
]));

gulp.task('watch', ['build'], function(){
  gulp.watch('src/*.es6', ['test']);
});
