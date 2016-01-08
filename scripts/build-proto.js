/* (c) 2016 EMIW, LLC. emiw.xyz/license */
var path = require('path');
var shell = require('shelljs');
var PROTOBUF_COMPILE_COMMAND = 'pbjs -t commonjs ';
var src = path.resolve(__dirname, '..', 'src');
var dist = process.argv[2];

// FIXME: Uncomment when shelljs/shelljs#275 is released.
// shell.ls(path.join(src, '**', '*.proto'))
shell.ls('-R', src).filter(function onlyProtoFiles(file) { // And get rid of this.
  return path.extname(file) === '.proto';
})
.forEach(function compile(file) {
  shell.mkdir('-p', path.resolve(dist, file, '..'));
  shell.exec(PROTOBUF_COMPILE_COMMAND + path.resolve(src, file) + ' > ' + path.resolve(dist, file + '.js'));
});
