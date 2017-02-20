/*
 * Use this if you don't have zip on your machine...
 * or use it anyway...
 * it prepares an archive of your code for submission
 * in the file artifact_<id>.zip
 * where <id> is your student number.
 */
var fs = require('fs');
var archiver = require('archiver');
var id = require('./artifact/index.js');

var fn = (__dirname + '/artifact_'+id.id()+'.zip').toLowerCase();

console.log("Creating "+ fn);

var output = fs.createWriteStream(fn);
var archive = archiver('zip');

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('Done.  Please submit this file for assessment!');
});

archive.on('error', function(err) {
  throw err;
  console.log("We don't seem to be able to zip your work for you.\nPlease manually zip it.");
});

archive.pipe(output);

archive.directory('artifact').finalize();
