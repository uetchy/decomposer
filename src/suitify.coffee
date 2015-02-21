fs = require 'fs'

class Suitify
  constructor: ->
    @loadBowerrc (json) ->
      components_path = json.directory or 'bower_components'
      config_path = json.json or 'bower.json'
    return

  loadBowerrc: (cb) ->
    fs.readFile '.bowerrc', (err, data) ->
      if err
        return cb({})
      cb(data)

module.exports = Suitify
