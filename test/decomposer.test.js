var expect = require('chai').expect,
    through = require('through2'),
    path = require('path'),
    fs = require('fs'),
    gulp = require('gulp'),
    decomposer = require('../decomposer.js')

describe('decomposer', function() {
  var filename = path.join(__dirname, './fixtures/index.sass');

  it('can create instance', function(done) {
    gulp.src(filename)
      .pipe(decomposer())
      .pipe(through.obj(function(file, enc, cb) {
        var expected = String(fs.readFileSync(path.join(__dirname, './fixtures/index.sass.expected')));
        expect(String(file.contents)).to.be.equal(expected);
        done();
      }));
  });
});
