var concat = require('../');
var should = require('should');
var os = require('os');
var path = require('path');
var File = require('gulp-util').File;
var Buffer = require('buffer').Buffer;
require('mocha');

describe('gulp-concat', function() {
  var fakeFile  = null;
  var fakeFile2 = null;
  beforeEach(function(){
    fakeFile = new File({
      cwd: "/home/contra/",
      base: "/home/contra/test",
      path: "/home/contra/test/file.js",
      contents: new Buffer("wadup")
    });

    fakeFile2 = new File({
      cwd: "/home/contra/",
      base: "/home/contra/test",
      path: "/home/contra/test/file2.js",
      contents: new Buffer("doe")
    });
    
  });
  describe('concat()', function() {
    it('should concat two files', function(done) {
      var stream = concat("test.js");

      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        var newFilePath = path.resolve(newFile.path);
        var expectedFilePath = path.resolve("/home/contra/test/test.js");
        newFilePath.should.equal(expectedFilePath);

        newFile.relative.should.equal("test.js");
        String(newFile.contents).should.equal("wadup\ndoe");
        Buffer.isBuffer(newFile.contents).should.equal(true);
        done();
      });
      stream.write(fakeFile);
      stream.write(fakeFile2);
    });

    it('should concat two files by custom EOL', function(done) {
      var stream = concat("test.js", {newLine: '\r\n'});

      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        var newFilePath = path.resolve(newFile.path);
        var expectedFilePath = path.resolve("/home/contra/test/test.js");
        newFilePath.should.equal(expectedFilePath);

        newFile.relative.should.equal("test.js");
        String(newFile.contents).should.equal("wadup\r\ndoe");
        Buffer.isBuffer(newFile.contents).should.equal(true);
        done();
      });
      stream.write(fakeFile);
      stream.write(fakeFile2);
    });

    it('should order through a glob pattern array', function(done){
      var stream = concat("test.js", {newLine: '\r\n', order:['**/file2.js', '**/file.js']});
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        var newFilePath      = path.resolve(newFile.path);
        var expectedFilePath = path.resolve("/home/contra/test/test.js");
        newFilePath.should.equal(expectedFilePath);

        newFile.relative.should.equal("test.js");
        String(newFile.contents).should.equal("doe\r\nwadup");
        Buffer.isBuffer(newFile.contents).should.equal(true);
        done();
      });
      stream.write(fakeFile);
      stream.write(fakeFile2);
    })
  });
});
