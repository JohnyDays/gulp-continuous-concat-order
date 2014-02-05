var Stream = require('stream');
var path = require('path');
var gutil = require('gulp-util');
var _ = require('lodash');
var PluginError = gutil.PluginError;
var File = gutil.File;


module.exports = function(fileName, opt){
  if (!fileName) throw new PluginError('gulp-concat',  'Missing fileName option for gulp-concat');
  if (!opt) opt = {};
  if (!opt.newLine) opt.newLine = gutil.linefeed;

  var buffer = {};
  var firstFile = null;
  var stream = new Stream.Transform({objectMode: true});

  stream._transform = function(file, encoding, done) {
    console.log('file inbound: ', file.path);
    if (file.isNull()) { return done(); } // ignore
    if (file.isStream()) { 
      this.emit('error', new PluginError('gulp-concat',  'Streaming not supported'));
      return done();
    }

    if (!firstFile) { firstFile = file; }

    buffer[file.path] = file.contents.toString('utf8');

    buildFile();
    done()
  }

  var buildFile = _.debounce(function() {
    if (Object.keys(buffer).length === 0) { return; }

    var contents = [];
    for (filepath in buffer) {
      contents.push(buffer[filepath]);
    }
    var joinedContents = contents.join(opt.newLine);

    var joinedPath = path.join(firstFile.base, fileName);

    var joinedFile = new File({
      cwd: firstFile.cwd,
      base: firstFile.base,
      path: joinedPath,
      contents: new Buffer(joinedContents)
    });

    stream.push(joinedFile);
  }, opt.debounce || 100);

  return stream;
};
