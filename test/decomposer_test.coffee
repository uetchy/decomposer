{expect} = require('chai')
through = require('through2')
path = require('path')
fs = require('fs')
mocks = require('mocks')
{loadFile} = mocks
gulp = require('gulp')
decomposer = require('../decomposer')


describe 'decomposer', ->
  before ->
    process.chdir './test/fixtures/package_1/'

  describe 'in top directory', ->
    filename = path.join(__dirname, './fixtures/package_1/index.sass')
    it 'can resolve path', (done) ->
      gulp.src(filename).pipe(decomposer()).pipe through.obj((file, enc, cb) ->
        expected = String(fs.readFileSync(path.join(__dirname, './fixtures/package_1/index.sass.expected')))
        expect(String(file.contents)).to.be.equal expected
        done()
      )

  describe 'in sub-directory', ->
    it 'can resolve path', (done) ->
      filename = path.join(__dirname, './fixtures/package_1/lib/lib.sass')
      gulp.src(filename).pipe(decomposer()).pipe through.obj((file, enc, cb) ->
        expected = String(fs.readFileSync(path.join(__dirname, './fixtures/package_1/lib/lib.sass.expected')))
        expect(String(file.contents)).to.be.equal expected
        done()
      )

    it 'can resolve path / 2', (done) ->
      filename = path.join(__dirname, './fixtures/package_1/lib/components/component.sass')
      gulp.src(filename).pipe(decomposer()).pipe through.obj((file, enc, cb) ->
        expected = String(fs.readFileSync(path.join(__dirname, './fixtures/package_1/lib/components/component.sass.expected')))
        expect(String(file.contents)).to.be.equal expected
        done()
      )
