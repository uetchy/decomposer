var expect = require('chai').expect,
    through = require('through2'),
    path = require('path'),
    fs = require('fs'),
    mocks = require('mocks'),
    loadFile = mocks.loadFile,
    gulp = require('gulp'),
    decomposer = require('../decomposer')

describe('decomposer', function() {
  before(function() {
    process.chdir('./test/fixtures/package_1/');
  });

  describe('in top directory', function() {
    var filename = path.join(__dirname, './fixtures/package_1/index.sass');

    it('can resolve path', function(done) {
      gulp.src(filename)
        .pipe(decomposer())
        .pipe(through.obj(function(file, enc, cb) {
          var expected = String(fs.readFileSync(path.join(__dirname, './fixtures/package_1/index.sass.expected')));
          expect(String(file.contents)).to.be.equal(expected);
          done();
        }));
    });
  });

  describe('in sub-directory', function() {
    it('can resolve path', function(done) {
      var filename = path.join(__dirname, './fixtures/package_1/lib/lib.sass');

      gulp.src(filename)
        .pipe(decomposer())
        .pipe(through.obj(function(file, enc, cb) {
          var expected = String(fs.readFileSync(path.join(__dirname, './fixtures/package_1/lib/lib.sass.expected')));
          expect(String(file.contents)).to.be.equal(expected);
          done();
        }));
    });

    it('can resolve path / 2', function(done) {
      var filename = path.join(__dirname, './fixtures/package_1/lib/components/component.sass');

      gulp.src(filename)
        .pipe(decomposer())
        .pipe(through.obj(function(file, enc, cb) {
          var expected = String(fs.readFileSync(path.join(__dirname, './fixtures/package_1/lib/components/component.sass.expected')));
          expect(String(file.contents)).to.be.equal(expected);
          done();
        }));
    });
  });
});
