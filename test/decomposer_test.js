'use strict';

import assert from 'power-assert';
import through from 'through2';
import path from 'path';
import fs from 'fs';
import gulp from 'gulp';
import decomposer from '../decomposer';

describe('decomposer', ()=> {
  before(()=> {
    return process.chdir('./test/fixtures/package_1/');
  });

  describe('in top directory', ()=> {
    it('can resolve path', (done)=> {
      var filename = path.join(__dirname, './fixtures/package_1/index.sass');
      gulp.src(filename)
        .pipe(decomposer())
        .pipe(through.obj(function(file) {
          var expected = fs.readFileSync(path.join(
            __dirname,
            './fixtures/package_1/index.sass.expected'));
          assert( String(file.contents) === String(expected) );
          done();
        })
      );
    });
  });

  describe('in sub-directory', ()=> {
    it('can resolve path', (done)=> {
      var filename = path.join(__dirname, './fixtures/package_1/lib/lib.sass');
      gulp.src(filename)
        .pipe(decomposer())
        .pipe(through.obj((file)=> {
          var expected = fs.readFileSync(path.join(
            __dirname,
            './fixtures/package_1/lib/lib.sass.expected'));
          assert( String(file.contents) === String(expected) );
          done();
        })
      );
    });

    it('can resolve path / 2', (done)=> {
      var filename = path.join(__dirname, './fixtures/package_1/lib/components/component.sass');
      gulp.src(filename)
        .pipe(decomposer())
        .pipe(through.obj((file)=> {
          var expected = fs.readFileSync(path.join(
            __dirname,
            './fixtures/package_1/lib/components/component.sass.expected'));
          assert( String(file.contents) === String(expected) );
          done();
        })
      );
    });
  });
});
