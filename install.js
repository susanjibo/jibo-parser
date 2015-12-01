var fs = require('fs');
var path = require('path');
var version = require('./package').version;
var nugget = require('nugget');
var homePath = require('home-path');
var mkdir = require('mkdirp');
var pathExists = require('path-exists');
var extract = require('extract-zip');

var libs = path.resolve(__dirname, 'deps', process.platform, 'lib');

var downloadUrl;
var target = 'jibo-nlu-js-v' + version + '-darwin.zip';

if(process.platform === 'darwin') {
    downloadUrl = 'http://repository.jibo.com/sdk/jibo-nlu-js/' + target;
}
else if(process.platform === 'linux') {

}
else if(process.platform === 'win32') {

}

var cacheDir = path.join(homePath(), '.jibo', 'tmp');
var exists = pathExists.sync(cacheDir);
if(!exists) {
    mkdir.sync(cacheDir);
}

var opts = {
    target: target,
    dir: cacheDir,
    verbose: true,
    strictSSL: true,
    resume: true
};

console.log(downloadUrl);

nugget(downloadUrl, opts, function(err) {
    if(err) {
        console.error(err);
        return;
    }
    extract(path.join(cacheDir, target), {dir: path.join(__dirname, '..')}, function (err) {
        if(!err) {
            console.log('done')
        }
    });
});