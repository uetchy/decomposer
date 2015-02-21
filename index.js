(function() {
  var Suitify, fs;

  fs = require('fs');

  Suitify = (function() {
    function Suitify() {
      this.loadBowerrc(function(json) {
        var components_path, config_path;
        components_path = json.directory || 'bower_components';
        return config_path = json.json || 'bower.json';
      });
      return;
    }

    Suitify.prototype.loadBowerrc = function(cb) {
      return fs.readFile('.bowerrc', function(err, data) {
        if (err) {
          return cb({});
        }
        return cb(data);
      });
    };

    return Suitify;

  })();

  module.exports = Suitify;

}).call(this);
