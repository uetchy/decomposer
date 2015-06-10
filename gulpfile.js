'use strict';

var gulp = require('gulp');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');

gulp.task('build', function(){
  gulp.src('src/*.js')
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(babel())
    .pipe(gulp.dest('./'));
});

gulp.task('watch', ['build'], function(){
  gulp.watch('src/*.js', ['build']);
});
