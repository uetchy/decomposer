'use strict';

import {expect} from 'chai';
import through from 'through2';
import path from 'path';
import fs from 'fs';
import gulp from 'gulp';
import decomposer from '../decomposer';

describe('decomposer', function() {
  before(()=> {
    return process.chdir('./test/fixtures/package_1/');
  });

  describe('in top directory', function() {
    it('can resolve path', function(done) {
      var filename = path.join(__dirname, './fixtures/package_1/index.sass');
      gulp.src(filename)
        .pipe(decomposer())
        .pipe(through.obj(function(file) {
          var expected = fs.readFileSync(path.join(
            __dirname,
            './fixtures/package_1/index.sass.expected'));
          expect(String(file.contents)).to.be.equal(String(expected));
          done();
        })
      );
    });
  });

  describe('in sub-directory', function() {
    it('can resolve path', function(done) {
      var filename = path.join(__dirname, './fixtures/package_1/lib/lib.sass');
      gulp.src(filename)
        .pipe(decomposer())
        .pipe(through.obj(function(file) {
          var expected = fs.readFileSync(path.join(
            __dirname,
            './fixtures/package_1/lib/lib.sass.expected'));
          expect(String(file.contents)).to.be.equal(String(expected));
          done();
        })
      );
    });

    it('can resolve path / 2', function(done) {
      var filename = path.join(__dirname, './fixtures/package_1/lib/components/component.sass');
      gulp.src(filename)
        .pipe(decomposer())
        .pipe(through.obj(function(file) {
          var expected = fs.readFileSync(path.join(
            __dirname,
            './fixtures/package_1/lib/components/component.sass.expected'));
          expect(String(file.contents)).to.be.equal(String(expected));
          done();
        })
      );
    });
  });
});
