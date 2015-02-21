gulp = require 'gulp'

coffee = require 'gulp-coffee'

gulp.task 'scripts', ->
  gulp.src 'src/**/*.coffee'
    .pipe coffee()
    .pipe gulp.dest './'

gulp.task 'watch', ['scripts'], ->
  gulp.watch 'src/**/*.coffee', ['scripts']
