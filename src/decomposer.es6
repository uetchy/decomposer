"use strict";

import fs from 'fs';
import path from 'path';
import through from 'through2';
import gutil from 'gulp-util';

let MATCHER = /@import\s+["']?([\w\.\/\-=\(\)]+)(?:["']\s*;)?/;
let PLUGIN_NAME = 'Decomposer';

function guessEOL(strings) {
  return strings.match(/(\r?\n)/)[1];
}

function setupBowerOptions(basePath) {
  if (basePath == null) {
    basePath = process.cwd();
  }
  var opt = {
    configPath: path.join(basePath, 'bower.json'),
    componentsPath: path.join(basePath, 'bower_components')
  };
  var files = fs.readdirSync(basePath);
  if (files.indexOf('.bowerrc') !== -1) {
    var temp = fs.readFileSync(path.join(basePath, '.bowerrc'));
    if (temp) {
      var json = JSON.parse(temp);
      if (json.json) {
        opt.configPath = path.join(basePath, json.json);
      }
      if (json.directory) {
        opt.componentsPath = path.join(basePath, json.directory);
      }
    }
  }
  return opt;
}

function guessBowerMainFile(moduleName, modulePath) {
  var bowerOptions = setupBowerOptions(modulePath);
  var mainFiles = JSON.parse(fs.readFileSync(bowerOptions.configPath)).main;
  if (mainFiles) {
    if (typeof mainFiles === 'string') {
      return mainFiles;
    }
    for (let file of mainFiles) {
      var filename = path.basename(file, path.extname(file));
      if (filename === moduleName || filename === 'index') {
        return file;
      }
    }
  }
  return moduleName;
}

export default function Decomposer(options) {
  if (options == null) {
    options = {};
  }

  var basePath = process.cwd();
  var bowerOptions = setupBowerOptions(basePath);

  return through.obj(function(file, encoding, callback) {
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streams are not supported'));
      return callback();
    }
    var fileDir = path.dirname(file.path);
    var fileContents = String(file.contents);
    var eol = guessEOL(fileContents);
    var lines = fileContents.split(/\r?\n/);
    for (let i in lines) {
      var line = lines[i];
      var res = line.match(MATCHER);
      if (res) {
        var ref = res[1].split('/'), moduleName = ref[0], specifiedTargetPath = ref[1];
        var modulePath = bowerOptions.componentsPath + '/' + moduleName;
        var targetPath = specifiedTargetPath || guessBowerMainFile(moduleName, modulePath);
        var targetPathRelative = path.relative(fileDir, modulePath + '/' + targetPath);
        lines[i] = line.replace(res[1], targetPathRelative);
      }
    }
    file.contents = new Buffer(lines.join(eol));
    this.push(file);
    return callback();
  });
}
