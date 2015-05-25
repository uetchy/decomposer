'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = Decomposer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _through2 = require('through2');

var _through22 = _interopRequireDefault(_through2);

var _gulpUtil = require('gulp-util');

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var MATCHER = /@import\s+["']?([\w\.\/\-=\(\)]+)(?:["']\s*;)?/;
var PLUGIN_NAME = 'Decomposer';

function guessEOL(strings) {
  return strings.match(/(\r?\n)/)[1];
}

function setupBowerOptions(basePath) {
  if (basePath == null) {
    basePath = process.cwd();
  }
  var opt = {
    configPath: _path2['default'].join(basePath, 'bower.json'),
    componentsPath: _path2['default'].join(basePath, 'bower_components')
  };
  var files = _fs2['default'].readdirSync(basePath);
  if (files.indexOf('.bowerrc') !== -1) {
    var temp = _fs2['default'].readFileSync(_path2['default'].join(basePath, '.bowerrc'));
    if (temp) {
      var json = JSON.parse(temp);
      if (json.json) {
        opt.configPath = _path2['default'].join(basePath, json.json);
      }
      if (json.directory) {
        opt.componentsPath = _path2['default'].join(basePath, json.directory);
      }
    }
  }
  return opt;
}

function guessBowerMainFile(moduleName, modulePath) {
  var bowerOptions = setupBowerOptions(modulePath);
  var mainFiles = JSON.parse(_fs2['default'].readFileSync(bowerOptions.configPath)).main;
  if (mainFiles) {
    if (typeof mainFiles === 'string') {
      return mainFiles;
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = mainFiles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var file = _step.value;

        var filename = _path2['default'].basename(file, _path2['default'].extname(file));
        if (filename === moduleName || filename === 'index') {
          return file;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
  return moduleName;
}

function Decomposer(options) {
  if (options == null) {
    options = {};
  }

  var basePath = process.cwd();
  var bowerOptions = setupBowerOptions(basePath);

  return _through22['default'].obj(function (file, encoding, callback) {
    if (file.isStream()) {
      this.emit('error', new _gulpUtil2['default'].PluginError(PLUGIN_NAME, 'Streams are not supported'));
      return callback();
    }
    var fileDir = _path2['default'].dirname(file.path);
    var fileContents = String(file.contents);
    var eol = guessEOL(fileContents);
    var lines = fileContents.split(/\r?\n/);
    for (var i in lines) {
      var line = lines[i];
      var res = line.match(MATCHER);
      if (res) {
        var ref = res[1].split('/'),
            moduleName = ref[0],
            specifiedTargetPath = ref[1];
        var modulePath = bowerOptions.componentsPath + '/' + moduleName;
        var targetPath = specifiedTargetPath || guessBowerMainFile(moduleName, modulePath);
        var targetPathRelative = _path2['default'].relative(fileDir, modulePath + '/' + targetPath);
        lines[i] = line.replace(res[1], targetPathRelative);
      }
    }
    file.contents = new Buffer(lines.join(eol));
    this.push(file);
    return callback();
  });
}

module.exports = exports['default'];