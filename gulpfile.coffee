gulp    = require 'gulp'
plumber = require 'gulp-plumber'
babel   = require 'gulp-babel'

gulp.task 'babel', ->
  gulp.src 'src/*.es6'
    .pipe plumber()
    .pipe babel()
    .pipe gulp.dest './'

gulp.task 'watch', ['babel'], ->
  gulp.watch 'src/*.es6', ['babel']
