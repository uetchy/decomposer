# Decomposer

Decomposer is a [__Gulp__](http://gulpjs.com/) plugin that provides __@import__ path resolver for [__Bower__](http://bower.io/).

Here is example:

__gulpfile.coffee__

```node
decomposer = require 'decomposer'
sass = require 'gulp-sass'

gulp.task 'styles', ->
  gulp.src 'src/styles/**/*.sass'
    .pipe decomposer()
    .pipe sass(indentedSyntax: true)
    .pipe gulp.dest 'dist/css'
```

and __src/styles/index.sass__,

```sass
@import normalize.sass

body {
  ...
}
```

> `normalize.sass` is actually located at __bower_components__.

After processing through Decomposer, all of @import paths in __dist/css/index.css__ will be resolved like this:

```sass
@import ../bower_components/normalize.sass/normalize.sass

body {
  ...
}
```
