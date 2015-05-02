fs      = require 'fs'
path    = require 'path'
through = require 'through2'
gutil   = require 'gulp-util'

MATCHER = /@import\s+["']?([\w\.\/\-=\(\)]+)(?:["']\s*;)?/
PLUGIN_NAME = 'Decomposer'

Decomposer = (options = {}) ->
  basePath     = process.cwd()
  bowerOptions = setupBowerOptions(basePath)

  through.obj (file, encoding, callback) ->
    if file.isStream()
      @emit 'error', new gutil.PluginError PLUGIN_NAME, 'Streams are not supported'
      return callback()

    fileDir      = path.dirname(file.path)
    fileContents = String(file.contents)
    eol          = guessEOL(fileContents)
    lines        = fileContents.split(/\r?\n/)

    for line, i in lines
      if res = line.match(MATCHER)
        [moduleName, specifiedTargetPath] = res[1].split('/')
        modulePath = bowerOptions.componentsPath + '/' + moduleName

        targetPath = specifiedTargetPath || guessBowerMainFile(moduleName, modulePath)
        targetPathRelative = path.relative(fileDir, modulePath + '/' + targetPath)

        lines[i] = line.replace(res[1], targetPathRelative)

    file.contents = new Buffer(lines.join(eol))

    @push file
    callback()

guessEOL = (strings) ->
  strings.match(/(\r?\n)/)[1]

setupBowerOptions = (basePath = process.cwd())->
  opt =
    configPath: path.join(basePath, 'bower.json')
    componentsPath: path.join(basePath, 'bower_components')

  files = fs.readdirSync(basePath)

  if files.indexOf('.bowerrc') != -1
    if temp = fs.readFileSync(path.join(basePath, '.bowerrc'))
      json = JSON.parse(temp)

      if json.json
        opt.configPath = path.join(basePath, json.json)

      if json.directory
        opt.componentsPath = path.join(basePath, json.directory)

  return opt

guessBowerMainFile = (moduleName, modulePath) ->
  bowerOptions = setupBowerOptions(modulePath)

  if mainFiles = JSON.parse(fs.readFileSync(bowerOptions.configPath)).main
    if typeof(mainFiles) == 'string'
      return mainFiles

    for file in mainFiles
      filename = path.basename(file, path.extname(file))
      if filename == moduleName || filename == 'index'
        return file

  return moduleName

module.exports = Decomposer
