var map = require('map-stream');
var gutil = require('gulp-util');
var hamlc = require('haml-coffee');

module.exports = function(options) {
  if(!options) options = {};
  if(!options.ext) options.ext = '.html';

  var htmlescape = function(input) {
    input = input.replace('</script>', '</scr" + "ipt>');
    input = JSON.stringify(input) + ';';
    return input;
  };

  var wrapIt = function(input, options) {
      input = options.namespace + "['" + options.name + "'] = " + input;
      input = '\n' + input + '\n';
      return input;
  };

  // Map each file to this function
  function hamlStream(file, cb) {
    // Remember that contents is ALWAYS a buffer
    if (file.isNull()) return cb(null, file); // pass along
    if (file.isStream()) return cb(new Error("gulp-hamlc: Streaming not supported"));


    var output = hamlc.compile(file.contents.toString("utf8"), options)(options.context);

    file.path = gutil.replaceExtension(file.path, options.ext);
    file.contents = new Buffer(wrapIt(htmlescape(output), options));

    cb(null, file);
  }

  // Return a stream
  return map(hamlStream);
};