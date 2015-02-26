# Decomposer

[![Build Status](https://travis-ci.org/uetchy/decomposer.svg?branch=master)](https://travis-ci.org/uetchy/decomposer)

Decomposer is a [__Gulp__](http://gulpjs.com/) plugin that provides __@import__ path resolver for [__Bower__](http://bower.io/).

Here is example:

__gulpfile.coffee__

```node
gulp = require 'gulp'
sass = require 'gulp-sass'
decomposer = require 'decomposer'

gulp.task 'styles', ->
  gulp.src 'src/styles/**/*.sass'
    .pipe decomposer()
    .pipe sass(indentedSyntax: true)
    .pipe gulp.dest 'dist/css'
```

and __src/styles/index.sass__,

```sass
@import normalize.sass

body
  ...
```

> `normalize.sass` is actually located at __bower_components__.

After processing through Decomposer, all of @import paths in __dist/css/index.css__ will be resolved like this:

```sass
@import ../bower_components/normalize.sass/normalize.sass

body
  ...
```

## Installation

```console
$ npm install --save-dev decomposer
```

## Testing

```console
$ npm install
$ npm test
```

## Contributing

1. Fork it ( https://github.com/uetchy/decomposer/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
