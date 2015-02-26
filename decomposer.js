var Decomposer, MATCHER, PLUGIN_NAME, fs, guessBowerMainFile, guessEOL, gutil, path, setupBowerOptions, through;

fs = require('fs');

path = require('path');

through = require('through2');

gutil = require('gulp-util');

MATCHER = /@import\s+["']?([\w\.\/\-=\(\)]+)(?:["']\s*;)?/;

PLUGIN_NAME = 'Decomposer';

Decomposer = function(options) {
  var basePath, bowerOptions;
  if (options == null) {
    options = {};
  }
  basePath = process.cwd();
  bowerOptions = setupBowerOptions(basePath);
  return through.obj(function(file, encoding, callback) {
    var eol, fileContents, fileDir, i, j, len, line, lines, moduleName, modulePath, ref, res, specifiedTargetPath, targetPath, targetPathRelative;
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streams are not supported'));
      return callback();
    }
    fileDir = path.dirname(file.path);
    fileContents = String(file.contents);
    eol = guessEOL(fileContents);
    lines = fileContents.split(/\r?\n/);
    for (i = j = 0, len = lines.length; j < len; i = ++j) {
      line = lines[i];
      if (res = line.match(MATCHER)) {
        ref = res[1].split('/'), moduleName = ref[0], specifiedTargetPath = ref[1];
        modulePath = bowerOptions.componentsPath + '/' + moduleName;
        targetPath = specifiedTargetPath || guessBowerMainFile(moduleName, modulePath);
        targetPathRelative = path.relative(fileDir, modulePath + '/' + targetPath);
        lines[i] = line.replace(res[1], targetPathRelative);
      }
    }
    file.contents = new Buffer(lines.join(eol));
    this.push(file);
    return callback();
  });
};

guessEOL = function(strings) {
  return strings.match(/(\r?\n)/)[1];
};

setupBowerOptions = function(basePath) {
  var files, json, opt, temp;
  if (basePath == null) {
    basePath = process.cwd();
  }
  opt = {
    configPath: path.join(basePath, '/bower.json'),
    componentsPath: path.join(basePath, '/bower_components')
  };
  files = fs.readdirSync(basePath);
  if (files.indexOf('.bowerrc') !== -1) {
    if (temp = fs.readFileSync(basePath + '/.bowerrc')) {
      json = JSON.parse(temp);
      if (json.json) {
        opt.configPath = path.join(basePath, json.json);
      }
      if (json.directory) {
        opt.componentsPath = path.join(basePath, json.directory);
      }
    }
  }
  return opt;
};

guessBowerMainFile = function(moduleName, modulePath) {
  var bowerOptions, file, filename, j, len, mainFiles;
  bowerOptions = setupBowerOptions(modulePath);
  if (mainFiles = JSON.parse(fs.readFileSync(bowerOptions.configPath)).main) {
    if (typeof mainFiles === 'string') {
      return mainFiles;
    }
    for (j = 0, len = mainFiles.length; j < len; j++) {
      file = mainFiles[j];
      filename = path.basename(file, path.extname(file));
      if (filename === moduleName || filename === 'index') {
        return file;
      }
    }
  }
  return moduleName;
};

module.exports = Decomposer;
